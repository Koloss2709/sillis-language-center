from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pydantic import BaseModel

from security import (
    verify_admin_access, 
    hash_password,
    sanitize_dict,
    validate_news_update_fields,
    SecurityMiddleware
)

logger = logging.getLogger(__name__)

# Create router
admin_router = APIRouter()

# Database connection - will be initialized after env loading
client = None
db = None

def init_db():
    global client, db
    if client is None:
        from dotenv import load_dotenv
        from pathlib import Path
        ROOT_DIR = Path(__file__).parent.parent
        load_dotenv(ROOT_DIR / '.env')
        
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]

# Models
class AdminLogin(BaseModel):
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    token: str
    message: str

class AdminStats(BaseModel):
    total_news: int
    total_contact_submissions: int
    recent_submissions: int  # last 7 days
    published_news: int

@admin_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLogin):
    """
    Вход в админ панель
    
    Body:
    - password: пароль администратора
    
    Returns:
    - token: токен для авторизации (хэш пароля)
    """
    try:
        # Получаем хэш пароля из переменных окружения
        admin_password_hash = os.getenv('ADMIN_PASSWORD_HASH')
        
        # Если не настроен в продакшене, используем дефолтный пароль "admin123"
        if not admin_password_hash:
            default_password_hash = hash_password("admin123")
            logger.warning("Using default admin password. Please set ADMIN_PASSWORD_HASH in production!")
        else:
            default_password_hash = admin_password_hash
        
        # Проверяем пароль
        provided_hash = hash_password(login_data.password)
        
        if provided_hash == default_password_hash:
            return AdminLoginResponse(
                success=True,
                token=provided_hash,  # Возвращаем хэш как токен
                message="Успешный вход в систему"
            )
        else:
            # Логируем попытку несанкционированного доступа
            SecurityMiddleware.log_security_event(
                "ADMIN_LOGIN_FAILED", 
                "Invalid password attempt"
            )
            raise HTTPException(
                status_code=401,
                detail="Неверный пароль"
            )
            
    except Exception as e:
        logger.error(f"Admin login error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка авторизации"
        )

@admin_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(admin_verified: bool = Depends(verify_admin_access)):
    """
    Получение статистики для админ панели
    
    Требует авторизации админа
    """
    init_db()
    try:
        # Подсчитываем статистику
        total_news = await db.news.count_documents({})
        published_news = await db.news.count_documents({"published": True})
        total_submissions = await db.contact_submissions.count_documents({})
        
        # Подсчитываем заявки за последние 7 дней
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_submissions = await db.contact_submissions.count_documents({
            "created_at": {"$gte": seven_days_ago}
        })
        
        return AdminStats(
            total_news=total_news,
            total_contact_submissions=total_submissions,
            recent_submissions=recent_submissions,
            published_news=published_news
        )
        
    except Exception as e:
        logger.error(f"Error getting admin stats: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения статистики"
        )

@admin_router.get("/admin/submissions")
async def get_admin_submissions(
    admin_verified: bool = Depends(verify_admin_access),
    skip: int = 0,
    limit: int = 20,
    status: str = None
):
    """
    Получение заявок на КП для админ панели
    
    Требует авторизации админа
    """
    init_db()
    try:
        # Санитизируем параметры
        skip = max(0, skip)
        limit = min(100, max(1, limit))  # Ограничиваем лимит
        
        # Строим запрос
        query = {}
        if status and status in ["new", "processed", "replied"]:
            query["status"] = status
        
        # Получаем заявки
        cursor = db.contact_submissions.find(query).sort("created_at", -1)
        submissions = await cursor.skip(skip).limit(limit).to_list(length=limit)
        
        # Общее количество
        total_count = await db.contact_submissions.count_documents(query)
        
        # Очищаем данные перед отправкой
        cleaned_submissions = []
        for submission in submissions:
            submission["_id"] = str(submission["_id"])
            # Санитизируем данные
            cleaned_submission = sanitize_dict(submission)
            cleaned_submissions.append(cleaned_submission)
        
        return {
            "submissions": cleaned_submissions,
            "total": total_count,
            "skip": skip,
            "limit": limit,
            "has_more": (skip + len(cleaned_submissions)) < total_count
        }
        
    except Exception as e:
        logger.error(f"Error getting admin submissions: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения заявок"
        )

@admin_router.put("/admin/submissions/{submission_id}/status")
async def update_submission_status_admin(
    submission_id: str,
    new_status: str,
    admin_verified: bool = Depends(verify_admin_access)
):
    """
    Обновление статуса заявки (админ версия)
    
    Требует авторизации админа
    """
    init_db()
    try:
        # Валидация статуса
        valid_statuses = ["new", "processed", "replied"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Некорректный статус. Допустимые: {', '.join(valid_statuses)}"
            )
        
        # Санитизируем ID
        from security import sanitize_string
        clean_submission_id = sanitize_string(submission_id, 50)
        
        # Обновляем статус
        result = await db.contact_submissions.update_one(
            {"id": clean_submission_id},
            {
                "$set": {
                    "status": new_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Заявка не найдена"
            )
        
        # Логируем изменение
        SecurityMiddleware.log_security_event(
            "SUBMISSION_STATUS_UPDATED",
            f"Submission {clean_submission_id} status changed to {new_status}"
        )
        
        return {
            "success": True,
            "message": "Статус заявки обновлен",
            "submission_id": clean_submission_id,
            "new_status": new_status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating submission status: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка обновления статуса"
        )

@admin_router.get("/admin/news")
async def get_admin_news(
    admin_verified: bool = Depends(verify_admin_access),
    skip: int = 0,
    limit: int = 20,
    published: bool = None
):
    """
    Получение новостей для админ панели (включая неопубликованные)
    
    Требует авторизации админа
    """
    init_db()
    try:
        # Санитизируем параметры
        skip = max(0, skip)
        limit = min(100, max(1, limit))
        
        # Строим запрос
        query = {}
        if published is not None:
            query["published"] = published
        
        # Получаем новости
        cursor = db.news.find(query).sort("date", -1)
        news_list = await cursor.skip(skip).limit(limit).to_list(length=limit)
        
        # Общее количество
        total_count = await db.news.count_documents(query)
        
        # Очищаем данные
        cleaned_news = []
        for news_item in news_list:
            news_item["_id"] = str(news_item["_id"])
            cleaned_news.append(sanitize_dict(news_item))
        
        return {
            "news": cleaned_news,
            "total": total_count,
            "skip": skip,
            "limit": limit,
            "has_more": (skip + len(cleaned_news)) < total_count
        }
        
    except Exception as e:
        logger.error(f"Error getting admin news: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения новостей"
        )

# Импортируем timedelta
from datetime import timedelta