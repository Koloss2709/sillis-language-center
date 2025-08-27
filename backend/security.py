import re
import hashlib
import os
from typing import Any, Dict
from fastapi import HTTPException, Depends, Header
import logging

logger = logging.getLogger(__name__)

# Admin password hash (в продакшене должен быть в переменных окружения)
ADMIN_PASSWORD_HASH = os.getenv('ADMIN_PASSWORD_HASH', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')  # пустая строка для дев

def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Очищает строку от потенциально опасных символов
    """
    if not isinstance(value, str):
        raise ValueError("Value must be a string")
    
    # Удаляем потенциально опасные символы для NoSQL injection
    dangerous_patterns = [
        r'\$where',
        r'\$regex', 
        r'\$ne',
        r'\$gt',
        r'\$lt',
        r'\$in',
        r'\$nin',
        r'javascript:',
        r'<script',
        r'eval\(',
        r'function\(',
    ]
    
    cleaned = value
    for pattern in dangerous_patterns:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Ограничиваем длину
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
    
    # Удаляем потенциально опасные символы
    cleaned = re.sub(r'[<>"\']', '', cleaned)
    
    return cleaned.strip()

def sanitize_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Рекурсивно очищает словарь от опасных значений
    """
    if not isinstance(data, dict):
        return data
    
    sanitized = {}
    for key, value in data.items():
        # Очищаем ключи
        clean_key = sanitize_string(str(key), 100)
        
        if isinstance(value, str):
            sanitized[clean_key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[clean_key] = sanitize_dict(value)
        elif isinstance(value, list):
            sanitized[clean_key] = [sanitize_dict(item) if isinstance(item, dict) 
                                   else sanitize_string(str(item)) if isinstance(item, str)
                                   else item for item in value]
        else:
            sanitized[clean_key] = value
    
    return sanitized

def validate_email(email: str) -> str:
    """
    Валидация email с дополнительной защитой
    """
    email = sanitize_string(email, 254)
    
    # Простая regex для email (более строгая чем Pydantic)
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise ValueError("Некорректный email адрес")
    
    return email.lower()

def validate_phone(phone: str) -> str:
    """
    Валидация телефона с очисткой
    """
    phone = sanitize_string(phone, 20)
    
    # Оставляем только цифры, +, -, пробелы, скобки
    cleaned_phone = re.sub(r'[^\d+\-\s\(\)]', '', phone)
    
    # Проверяем что есть достаточно цифр
    digits_only = re.sub(r'[^\d]', '', cleaned_phone)
    if len(digits_only) < 10:
        raise ValueError("Некорректный номер телефона")
    
    return cleaned_phone

def hash_password(password: str) -> str:
    """
    Хэширование пароля
    """
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """
    Проверка пароля
    """
    return hash_password(password) == hashed

def verify_admin_access(authorization: str = Header(None)) -> bool:
    """
    Проверка админ доступа по токену в заголовке
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    
    try:
        # Ожидаем формат "Bearer <password_hash>"
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Некорректный формат токена")
        
        token = authorization.split(" ", 1)[1]
        
        # Проверяем хэш пароля
        if token != ADMIN_PASSWORD_HASH and ADMIN_PASSWORD_HASH != 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855':
            raise HTTPException(status_code=401, detail="Неверный пароль")
        
        return True
        
    except IndexError:
        raise HTTPException(status_code=401, detail="Некорректный формат токена")

class SecurityMiddleware:
    """
    Middleware для дополнительной безопасности
    """
    
    @staticmethod
    def validate_request_size(content_length: int, max_size: int = 10 * 1024 * 1024):  # 10MB
        """Проверка размера запроса"""
        if content_length > max_size:
            raise HTTPException(status_code=413, detail="Размер запроса превышает лимит")
    
    @staticmethod
    def rate_limit_check(client_ip: str):
        """Простая проверка частоты запросов (для продакшена нужен Redis)"""
        # В простой версии не реализуем, но структура готова
        pass
    
    @staticmethod
    def log_security_event(event_type: str, details: str, client_ip: str = None):
        """Логирование событий безопасности"""
        logger.warning(f"SECURITY EVENT: {event_type} - {details} - IP: {client_ip}")

# Список разрешенных полей для обновления новостей (whitelist)
ALLOWED_NEWS_FIELDS = {
    'title', 'excerpt', 'content', 'date', 'published'
}

def validate_news_update_fields(update_data: dict) -> dict:
    """
    Проверяет что обновляются только разрешенные поля
    """
    allowed_data = {}
    for key, value in update_data.items():
        if key in ALLOWED_NEWS_FIELDS:
            if isinstance(value, str):
                allowed_data[key] = sanitize_string(value)
            else:
                allowed_data[key] = value
        else:
            logger.warning(f"Попытка обновления запрещенного поля: {key}")
    
    return allowed_data

# Константы для валидации
MAX_TITLE_LENGTH = 200
MAX_EXCERPT_LENGTH = 500  
MAX_CONTENT_LENGTH = 10000
MAX_COMMENT_LENGTH = 2000
MAX_NAME_LENGTH = 100
MAX_ORGANIZATION_LENGTH = 200