from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from security import verify_admin_access, sanitize_dict, sanitize_string

logger = logging.getLogger(__name__)

# Create router
content_router = APIRouter()

# Database connection
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

# Models for Content Management
class ContactInfo(BaseModel):
    email: str
    phones: List[str]
    address: str
    social: Dict[str, str]

class PackageItem(BaseModel):
    id: int
    name: str
    description: str
    features: List[str]
    popular: bool = False
    freeLesson: bool = False

class PackagesData(BaseModel):
    b2c: List[PackageItem]
    b2b: List[PackageItem]

class ContentUpdate(BaseModel):
    contacts: Optional[ContactInfo] = None
    packages: Optional[PackagesData] = None

# Default content structure
DEFAULT_CONTENT = {
    "contacts": {
        "email": "silisykt@mail.ru",
        "phones": ["8 914 287 0753", "8 964 076 7660"],
        "address": "г. Якутск, ул. Лермонтова 47, ТЦ НОРД, 4 этаж",
        "social": {
            "instagram": "silis_school",
            "telegram": "https://t.me/silisschool",
            "vk": "https://vk.com/siliscenter"
        }
    },
    "packages": {
        "b2c": [
            {
                "id": 1,
                "name": "Интенсивы",
                "description": "Быстрое погружение в язык",
                "features": ["Групповые занятия 3 раза в неделю", "Разговорная практика", "Домашние задания", "Поддержка преподавателя"],
                "popular": False,
                "freeLesson": True
            },
            {
                "id": 2,
                "name": "Частные занятия", 
                "description": "Индивидуальный подход",
                "features": ["Персональный преподаватель", "Гибкий график", "Индивидуальная программа", "Быстрый прогресс"],
                "popular": True,
                "freeLesson": True
            },
            {
                "id": 3,
                "name": "Вебинары",
                "description": "Онлайн обучение",
                "features": ["Доступ из любой точки мира", "Записи занятий", "Интерактивные материалы", "Сертификат участника"],
                "popular": False,
                "freeLesson": True
            }
        ],
        "b2b": [
            {
                "id": 1,
                "name": "Старт",
                "description": "Базовое сопровождение",
                "features": ["Консультация специалиста", "Базовый перевод документов", "Email поддержка"],
                "popular": False
            },
            {
                "id": 2,
                "name": "Стандарт",
                "description": "Комплексное сопровождение", 
                "features": ["Все из пакета Старт", "Деловые тренинги", "Телефонная поддержка", "Культурное консультирование"],
                "popular": True
            },
            {
                "id": 3,
                "name": "Премиум",
                "description": "Полное сопровождение",
                "features": ["Все из пакета Стандарт", "Персональный менеджер", "Срочные переводы", "Выездные тренинги"],
                "popular": False
            }
        ]
    }
}

@content_router.get("/content")
async def get_site_content():
    """
    Получение текущего контента сайта (контакты, пакеты)
    Доступно без авторизации для фронтенда
    """
    init_db()
    try:
        # Получаем контент из базы данных
        content = await db.site_content.find_one({"type": "main"})
        
        if not content:
            # Если контента нет, возвращаем дефолтный и сохраняем в БД
            await db.site_content.insert_one({
                "type": "main",
                "data": DEFAULT_CONTENT,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            return DEFAULT_CONTENT
        
        return content.get("data", DEFAULT_CONTENT)
        
    except Exception as e:
        logger.error(f"Error fetching site content: {e}")
        # В случае ошибки возвращаем дефолтный контент
        return DEFAULT_CONTENT

@content_router.put("/admin/content")
async def update_site_content(
    content_update: ContentUpdate,
    admin_verified: bool = Depends(verify_admin_access)
):
    """
    Обновление контента сайта (только для админов)
    
    Можно обновлять частично:
    - contacts: контактная информация
    - packages: пакеты услуг B2C и B2B
    """
    init_db()
    try:
        # Получаем текущий контент
        current_content = await db.site_content.find_one({"type": "main"})
        
        if not current_content:
            # Создаем новый документ
            current_data = DEFAULT_CONTENT.copy()
        else:
            current_data = current_content.get("data", DEFAULT_CONTENT.copy())
        
        # Обновляем только переданные поля
        update_data = {}
        
        if content_update.contacts:
            # Валидируем и санитизируем контакты
            contacts_data = content_update.contacts.dict()
            sanitized_contacts = sanitize_dict(contacts_data)
            current_data["contacts"] = sanitized_contacts
            update_data["contacts"] = sanitized_contacts
        
        if content_update.packages:
            # Валидируем и санитизируем пакеты
            packages_data = content_update.packages.dict()
            sanitized_packages = sanitize_dict(packages_data)
            current_data["packages"] = sanitized_packages
            update_data["packages"] = sanitized_packages
        
        # Сохраняем обновленный контент
        if not current_content:
            # Создаем новый документ
            await db.site_content.insert_one({
                "type": "main",
                "data": current_data,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        else:
            # Обновляем существующий
            await db.site_content.update_one(
                {"type": "main"},
                {
                    "$set": {
                        "data": current_data,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        
        logger.info(f"Site content updated: {list(update_data.keys())}")
        
        return {
            "success": True,
            "message": "Контент сайта успешно обновлен",
            "updated_fields": list(update_data.keys()),
            "data": current_data
        }
        
    except Exception as e:
        logger.error(f"Error updating site content: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка обновления контента сайта"
        )

@content_router.get("/admin/content")
async def get_admin_site_content(
    admin_verified: bool = Depends(verify_admin_access)
):
    """
    Получение контента для админ панели
    Включает дополнительную мета-информацию
    """
    init_db()
    try:
        content = await db.site_content.find_one({"type": "main"})
        
        if not content:
            return {
                "data": DEFAULT_CONTENT,
                "meta": {
                    "created_at": None,
                    "updated_at": None,
                    "is_default": True
                }
            }
        
        return {
            "data": content.get("data", DEFAULT_CONTENT),
            "meta": {
                "created_at": content.get("created_at"),
                "updated_at": content.get("updated_at"),
                "is_default": False
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching admin site content: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения контента"
        )

@content_router.post("/admin/content/reset")
async def reset_site_content(
    admin_verified: bool = Depends(verify_admin_access)
):
    """
    Сброс контента сайта к дефолтным значениям
    """
    init_db()
    try:
        # Удаляем текущий контент и создаем дефолтный
        await db.site_content.delete_many({"type": "main"})
        await db.site_content.insert_one({
            "type": "main",
            "data": DEFAULT_CONTENT,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        logger.info("Site content reset to defaults")
        
        return {
            "success": True,
            "message": "Контент сайта сброшен к значениям по умолчанию",
            "data": DEFAULT_CONTENT
        }
        
    except Exception as e:
        logger.error(f"Error resetting site content: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка сброса контента"
        )

# Отдельные endpoints для удобства
@content_router.put("/admin/contacts")
async def update_contacts_only(
    contacts: ContactInfo,
    admin_verified: bool = Depends(verify_admin_access)
):
    """
    Обновление только контактной информации
    """
    content_update = ContentUpdate(contacts=contacts)
    return await update_site_content(content_update, admin_verified)

@content_router.put("/admin/packages")
async def update_packages_only(
    packages: PackagesData,
    admin_verified: bool = Depends(verify_admin_access)
):
    """
    Обновление только пакетов услуг
    """
    content_update = ContentUpdate(packages=packages)
    return await update_site_content(content_update, admin_verified)