from fastapi import APIRouter, HTTPException, Request
from datetime import datetime
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os

from models import (
    ContactSubmissionCreate, 
    ContactSubmission, 
    ContactSubmissionResponse,
    ErrorResponse,
    EmailData
)
from email_service import email_service

logger = logging.getLogger(__name__)

# Create router
contact_router = APIRouter()

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


@contact_router.post("/contact-form", response_model=ContactSubmissionResponse)
async def submit_contact_form(
    submission: ContactSubmissionCreate,
    request: Request
):
    """
    Обработка заявки на коммерческое предложение
    
    - Валидирует данные формы
    - Сохраняет в базу данных
    - Отправляет email уведомления
    - Возвращает подтверждение
    """
    try:
        # Get client IP address
        client_ip = request.client.host if request.client else None
        
        # Create submission object
        submission_data = ContactSubmission(
            name=submission.name,
            phone=submission.phone,
            email=submission.email,
            organization=submission.organization,
            comment=submission.comment,
            agree=submission.agree,
            ip_address=client_ip,
            created_at=datetime.utcnow()
        )
        
        # Save to database
        submission_dict = submission_data.dict()
        result = await db.contact_submissions.insert_one(submission_dict)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Ошибка сохранения заявки")
        
        logger.info(f"Contact submission saved: {submission_data.id}")
        
        # Prepare email data
        email_data = EmailData(
            name=submission.name,
            phone=submission.phone,
            email=submission.email,
            organization=submission.organization,
            comment=submission.comment,
            created_at=submission_data.created_at
        )
        
        # Send notification emails (non-blocking)
        try:
            # Send notification to admin
            admin_email_sent = await email_service.send_submission_notification(email_data)
            
            # Send confirmation to client
            client_email_sent = await email_service.send_confirmation_email(email_data)
            
            logger.info(f"Admin email sent: {admin_email_sent}, Client email sent: {client_email_sent}")
            
        except Exception as email_error:
            # Log email error but don't fail the request
            logger.error(f"Email sending failed: {email_error}")
        
        return ContactSubmissionResponse(
            success=True,
            message="Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
            id=submission_data.id
        )
        
    except ValueError as ve:
        # Validation errors
        logger.warning(f"Validation error in contact form: {ve}")
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка валидации: {str(ve)}"
        )
        
    except Exception as e:
        # Unexpected errors
        logger.error(f"Unexpected error in contact form: {e}")
        raise HTTPException(
            status_code=500,
            detail="Произошла ошибка при обработке заявки. Попробуйте позже или свяжитесь с нами по телефону."
        )


@contact_router.get("/contact-submissions")
async def get_contact_submissions(
    skip: int = 0,
    limit: int = 50,
    status: str = None
):
    """
    Получение списка заявок (для админки)
    
    Query Parameters:
    - skip: количество записей для пропуска (pagination)
    - limit: максимальное количество записей
    - status: фильтр по статусу ("new", "processed", "replied")
    """
    try:
        # Build query filter
        query = {}
        if status:
            query["status"] = status
        
        # Get submissions with pagination
        cursor = db.contact_submissions.find(query).sort("created_at", -1)
        submissions = await cursor.skip(skip).limit(limit).to_list(length=limit)
        
        # Get total count
        total_count = await db.contact_submissions.count_documents(query)
        
        # Convert ObjectId to string for JSON serialization
        for submission in submissions:
            submission["_id"] = str(submission["_id"])
        
        return {
            "submissions": submissions,
            "total": total_count,
            "skip": skip,
            "limit": limit,
            "has_more": (skip + len(submissions)) < total_count
        }
        
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения заявок"
        )


@contact_router.put("/contact-submissions/{submission_id}/status")
async def update_submission_status(
    submission_id: str,
    status: str
):
    """
    Обновление статуса заявки
    
    Path Parameters:
    - submission_id: ID заявки
    
    Body:
    - status: новый статус ("new", "processed", "replied")
    """
    try:
        valid_statuses = ["new", "processed", "replied"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Некорректный статус. Допустимые значения: {', '.join(valid_statuses)}"
            )
        
        # Update submission status
        result = await db.contact_submissions.update_one(
            {"id": submission_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Заявка не найдена"
            )
        
        return {
            "success": True,
            "message": "Статус заявки обновлен",
            "submission_id": submission_id,
            "new_status": status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating submission status: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка обновления статуса заявки"
        )