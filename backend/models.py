from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime
import uuid


# Contact Form Models
class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    email: EmailStr
    organization: Optional[str] = Field(None, max_length=100)
    comment: Optional[str] = Field(None, max_length=1000)
    agree: bool

    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Имя не может быть пустым')
        return v.strip()

    @validator('phone')
    def validate_phone(cls, v):
        # Remove all non-digit characters
        clean_phone = ''.join(filter(str.isdigit, v))
        if len(clean_phone) < 10:
            raise ValueError('Некорректный номер телефона')
        return v

    @validator('agree')
    def validate_agree(cls, v):
        if not v:
            raise ValueError('Необходимо согласие на обработку данных')
        return v


class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    organization: Optional[str] = None
    comment: Optional[str] = None
    agree: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    status: str = "new"  # "new", "processed", "replied"


# News Models
class NewsCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    excerpt: str = Field(..., min_length=10, max_length=300)
    content: str = Field(..., min_length=50)
    date: str  # Will be converted to datetime

    @validator('title')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Заголовок не может быть пустым')
        return v.strip()

    @validator('excerpt')
    def validate_excerpt(cls, v):
        if not v.strip():
            raise ValueError('Краткое описание не может быть пустым')
        return v.strip()

    @validator('content')
    def validate_content(cls, v):
        if not v.strip():
            raise ValueError('Содержание не может быть пустым')
        return v.strip()


class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    excerpt: Optional[str] = Field(None, min_length=10, max_length=300)
    content: Optional[str] = Field(None, min_length=50)
    date: Optional[str] = None
    published: Optional[bool] = None


class News(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published: bool = True
    author: Optional[str] = None


# API Response Models
class ContactSubmissionResponse(BaseModel):
    success: bool
    message: str
    id: str


class NewsResponse(BaseModel):
    success: bool
    news: News
    message: str


class NewsListResponse(BaseModel):
    news: List[News]
    total: int
    has_more: bool


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: Optional[List[dict]] = None


# Email Models
class EmailData(BaseModel):
    name: str
    phone: str
    email: str
    organization: Optional[str]
    comment: Optional[str]
    created_at: datetime