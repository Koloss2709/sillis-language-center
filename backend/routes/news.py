from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Optional
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os

from models import (
    NewsCreate,
    NewsUpdate, 
    News,
    NewsResponse,
    NewsListResponse
)

logger = logging.getLogger(__name__)

# Create router
news_router = APIRouter()

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


@news_router.get("/news", response_model=NewsListResponse)
async def get_news(
    limit: int = 6,
    skip: int = 0,
    published: bool = True
):
    """
    Получение списка новостей
    
    Query Parameters:
    - limit: количество новостей (default: 6)
    - skip: пропустить новости (для пагинации)
    - published: показывать только опубликованные (default: true)
    """
    init_db()  # Initialize database connection
    try:
        # Build query filter
        query = {}
        if published:
            query["published"] = True
        
        # Get news with pagination, sorted by date descending
        cursor = db.news.find(query).sort("date", -1)
        news_list = await cursor.skip(skip).limit(limit).to_list(length=limit)
        
        # Get total count
        total_count = await db.news.count_documents(query)
        
        # Convert to News objects
        news_objects = []
        for news_item in news_list:
            # Convert ObjectId to string
            news_item["_id"] = str(news_item["_id"])
            
            # Ensure all required fields exist
            news_obj = News(
                id=news_item.get("id", str(news_item["_id"])),
                title=news_item["title"],
                excerpt=news_item["excerpt"],
                content=news_item["content"],
                date=news_item["date"],
                created_at=news_item.get("created_at", news_item["date"]),
                updated_at=news_item.get("updated_at", news_item["date"]),
                published=news_item.get("published", True),
                author=news_item.get("author")
            )
            news_objects.append(news_obj)
        
        return NewsListResponse(
            news=news_objects,
            total=total_count,
            has_more=(skip + len(news_objects)) < total_count
        )
        
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения новостей"
        )


@news_router.post("/news", response_model=NewsResponse)
async def create_news(news_data: NewsCreate):
    """
    Создание новой новости
    
    Body:
    - title: заголовок новости
    - excerpt: краткое описание
    - content: полное содержание
    - date: дата публикации (YYYY-MM-DD)
    """
    init_db()  # Initialize database connection
    try:
        # Parse date
        try:
            news_date = datetime.strptime(news_data.date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Некорректный формат даты. Используйте YYYY-MM-DD"
            )
        
        # Create news object
        news_obj = News(
            title=news_data.title,
            excerpt=news_data.excerpt,
            content=news_data.content,
            date=news_date,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save to database
        news_dict = news_obj.dict()
        result = await db.news.insert_one(news_dict)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Ошибка сохранения новости")
        
        logger.info(f"News created: {news_obj.id}")
        
        return NewsResponse(
            success=True,
            news=news_obj,
            message="Новость успешно создана"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating news: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка создания новости"
        )


@news_router.get("/news/{news_id}", response_model=News)
async def get_news_by_id(news_id: str):
    """
    Получение конкретной новости по ID
    
    Path Parameters:
    - news_id: ID новости
    """
    init_db()  # Initialize database connection
    try:
        news_item = await db.news.find_one({"id": news_id})
        
        if not news_item:
            raise HTTPException(
                status_code=404,
                detail="Новость не найдена"
            )
        
        # Convert ObjectId to string
        news_item["_id"] = str(news_item["_id"])
        
        # Create News object
        news_obj = News(
            id=news_item.get("id", str(news_item["_id"])),
            title=news_item["title"],
            excerpt=news_item["excerpt"], 
            content=news_item["content"],
            date=news_item["date"],
            created_at=news_item.get("created_at", news_item["date"]),
            updated_at=news_item.get("updated_at", news_item["date"]),
            published=news_item.get("published", True),
            author=news_item.get("author")
        )
        
        return news_obj
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching news by ID: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения новости"
        )


@news_router.put("/news/{news_id}", response_model=NewsResponse)
async def update_news(news_id: str, news_update: NewsUpdate):
    """
    Обновление новости
    
    Path Parameters:
    - news_id: ID новости
    
    Body: Любые поля для обновления
    """
    init_db()  # Initialize database connection
    try:
        # Build update data
        update_data = {"updated_at": datetime.utcnow()}
        
        if news_update.title is not None:
            update_data["title"] = news_update.title
        if news_update.excerpt is not None:
            update_data["excerpt"] = news_update.excerpt
        if news_update.content is not None:
            update_data["content"] = news_update.content
        if news_update.published is not None:
            update_data["published"] = news_update.published
        if news_update.date is not None:
            try:
                update_data["date"] = datetime.strptime(news_update.date, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Некорректный формат даты. Используйте YYYY-MM-DD"
                )
        
        # Update in database
        result = await db.news.update_one(
            {"id": news_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Новость не найдена"
            )
        
        # Get updated news
        updated_news = await db.news.find_one({"id": news_id})
        updated_news["_id"] = str(updated_news["_id"])
        
        news_obj = News(
            id=updated_news.get("id", str(updated_news["_id"])),
            title=updated_news["title"],
            excerpt=updated_news["excerpt"],
            content=updated_news["content"],
            date=updated_news["date"],
            created_at=updated_news.get("created_at", updated_news["date"]),
            updated_at=updated_news.get("updated_at", updated_news["date"]),
            published=updated_news.get("published", True),
            author=updated_news.get("author")
        )
        
        logger.info(f"News updated: {news_id}")
        
        return NewsResponse(
            success=True,
            news=news_obj,
            message="Новость успешно обновлена"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating news: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка обновления новости"
        )


@news_router.delete("/news/{news_id}")
async def delete_news(news_id: str):
    """
    Удаление новости
    
    Path Parameters:
    - news_id: ID новости
    """
    try:
        result = await db.news.delete_one({"id": news_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Новость не найдена"
            )
        
        logger.info(f"News deleted: {news_id}")
        
        return {
            "success": True,
            "message": "Новость успешно удалена",
            "news_id": news_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting news: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка удаления новости"
        )