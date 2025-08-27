# API Contracts - Центр якутского языка «Силис»

## Обзор интеграции

### Frontend Mock данные для замены:
1. **mockNews** → API новостей
2. **ContactForm** → API отправки КП
3. **Admin панель новостей** → CRUD API новостей

### Backend API Endpoints:

## 1. Contact Form API

### POST /api/contact-form
**Описание:** Отправка заявки на коммерческое предложение

**Request Body:**
```json
{
  "name": "string",
  "phone": "string", 
  "email": "string",
  "organization": "string (optional)",
  "comment": "string (optional)",
  "agree": boolean
}
```

**Response:**
```json
{
  "success": true,
  "message": "Заявка успешно отправлена",
  "id": "submission_id"
}
```

**Функционал:**
- Валидация данных
- Сохранение в MongoDB
- Отправка email уведомления на silisykt@mail.ru
- Отправка подтверждения клиенту

---

## 2. News API

### GET /api/news
**Описание:** Получение списка новостей

**Query Parameters:**
- `limit` (optional): количество новостей (default: 6)
- `skip` (optional): пропустить новости (для пагинации)

**Response:**
```json
{
  "news": [
    {
      "id": "string",
      "title": "string",
      "excerpt": "string",
      "content": "string",
      "date": "2025-08-20",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    }
  ],
  "total": number,
  "has_more": boolean
}
```

### POST /api/news
**Описание:** Создание новой новости (админ панель)

**Request Body:**
```json
{
  "title": "string",
  "excerpt": "string", 
  "content": "string",
  "date": "2025-08-20"
}
```

**Response:**
```json
{
  "success": true,
  "news": { /* news object */ },
  "message": "Новость успешно создана"
}
```

### PUT /api/news/{news_id}
**Описание:** Обновление новости

### DELETE /api/news/{news_id}  
**Описание:** Удаление новости

---

## 3. Email Service

### Настройка SMTP:
- **Сервис:** Gmail SMTP или другой
- **Получатель:** silisykt@mail.ru
- **Шаблоны:** HTML письма для КП и подтверждений

---

## 4. Frontend Integration Plan

### ContactForm.jsx:
```javascript
// Заменить mock отправку на:
const response = await axios.post(`${API}/contact-form`, formData);
```

### News.jsx:
```javascript
// Заменить mockNews на:
const { data } = await axios.get(`${API}/news?limit=6`);

// Добавление новости:
const response = await axios.post(`${API}/news`, newArticle);
```

---

## 5. Database Schema

### Contact Submissions Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  organization: String?,
  comment: String?,
  agree: Boolean,
  created_at: Date,
  ip_address: String?,
  status: String // "new", "processed", "replied"
}
```

### News Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  excerpt: String,
  content: String,
  date: Date,
  created_at: Date,
  updated_at: Date,
  published: Boolean,
  author: String?
}
```

---

## 6. Environment Variables

### Необходимые переменные (.env):
```
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  
SMTP_PASSWORD=your-app-password
EMAIL_FROM=silisykt@mail.ru
EMAIL_TO=silisykt@mail.ru

# Database
MONGO_URL=existing
DB_NAME=existing
```

---

## 7. Validation Rules

### Contact Form:
- name: required, min 2 chars
- phone: required, valid phone format
- email: required, valid email format  
- agree: must be true
- organization: optional, max 100 chars
- comment: optional, max 1000 chars

### News:
- title: required, min 5 chars, max 200 chars
- excerpt: required, min 10 chars, max 300 chars
- content: required, min 50 chars
- date: valid date format

---

## 8. Error Handling

### Standard Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 9. Security

### Measures:
- Rate limiting на API endpoints
- CORS уже настроен
- Input sanitization
- Email spam protection
- Basic validation на frontend + backend

---

## 10. Testing

### Endpoints для тестирования:
1. POST /api/contact-form - отправка КП
2. GET /api/news - получение новостей
3. POST /api/news - создание новости
4. Email delivery - проверка доставки писем