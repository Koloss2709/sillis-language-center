# 🚀 Руководство по деплою сайта центра "Силис"

## Этап 1: Настройка переменных окружения

### 1.1 Backend переменные (.env файл)
Создайте файл `/app/backend/.env` со следующими переменными:

```bash
# База данных (уже настроено)
MONGO_URL=mongodb://localhost:27017
DB_NAME=silis_center

# Email настройки (ОБЯЗАТЕЛЬНО настроить)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=silisykt@mail.ru
EMAIL_TO=silisykt@mail.ru

# Админ пароль (ОБЯЗАТЕЛЬНО изменить)
ADMIN_PASSWORD_HASH=fa00dc9466fc91dbcc7a18c0805598dbf78063d73374fb47d230153b980f5785

# Продакшн настройки
NODE_ENV=production
```

### 1.2 Frontend переменные (.env файл)
Создайте файл `/app/frontend/.env`:

```bash
# Backend URL (изменить на ваш домен)
REACT_APP_BACKEND_URL=https://yourdomain.com
```

## Этап 2: Настройка Email системы

### 2.1 Gmail SMTP (рекомендуется)
1. Войдите в Gmail аккаунт
2. Перейдите в "Управление аккаунтом Google"
3. Безопасность → Двухэтапная аутентификация (включить)
4. Безопасность → Пароли приложений
5. Создайте пароль для "Почта"
6. Используйте этот пароль в SMTP_PASSWORD

### 2.2 Альтернативы Gmail
- **Яндекс:** smtp.yandex.ru:587
- **Mail.ru:** smtp.mail.ru:587
- **SendGrid:** smtp.sendgrid.net:587

## Этап 3: Безопасность продакшена

### 3.1 Смена админ пароля
Генерируем новый пароль:

```bash
# На сервере выполните:
python3 -c "
import hashlib
password = 'YOUR_NEW_STRONG_PASSWORD'
print(hashlib.sha256(password.encode()).hexdigest())
"
```

Полученный хэш вставьте в ADMIN_PASSWORD_HASH

### 3.2 Настройки безопасности
- Используйте HTTPS (SSL сертификат)
- Настройте файрвол
- Регулярно обновляйте систему
- Делайте бэкапы базы данных

## Этап 4: Варианты деплоя

### Вариант 1: VPS сервер (рекомендуется)

#### 4.1 Подготовка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка зависимостей
sudo apt install nginx mongodb nodejs npm python3 python3-pip -y

# Установка PM2 для управления процессами
sudo npm install -g pm2
```

#### 4.2 Клонирование проекта
```bash
# Загрузите проект на сервер
git clone <your-repo> /var/www/silis
cd /var/www/silis

# Или скопируйте файлы через SCP/SFTP
```

#### 4.3 Настройка Backend
```bash
cd /app/backend

# Создайте виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Настройте .env файл
cp .env.example .env
nano .env  # Отредактируйте переменные

# Запуск через PM2
pm2 start "python server.py" --name silis-backend
pm2 startup
pm2 save
```

#### 4.4 Настройка Frontend
```bash
cd /app/frontend

# Установите зависимости
npm install

# Настройте .env файл
cp .env.example .env
nano .env  # Укажите URL вашего сервера

# Сборка для продакшена
npm run build

# Настройте Nginx для раздачи статики
sudo cp build/* /var/www/html/
```

#### 4.5 Настройка Nginx
Создайте конфиг `/etc/nginx/sites-available/silis`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend статика
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активируйте конфиг
sudo ln -s /etc/nginx/sites-available/silis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Вариант 2: Emergent Platform (простейший)

#### 4.1 Подключение репозитория
1. Создайте GitHub репозиторий
2. Загрузите весь проект `/app/`
3. Подключите репозиторий к Emergent

#### 4.2 Настройка переменных
В панели Emergent добавьте переменные окружения:
- SMTP настройки
- ADMIN_PASSWORD_HASH
- Другие переменные

#### 4.3 Автоматический деплой
Emergent автоматически:
- Соберет frontend
- Запустит backend
- Настроит домен

### Вариант 3: Vercel + Railway/Heroku

#### 4.1 Frontend на Vercel
```bash
# Установите Vercel CLI
npm i -g vercel

# В папке frontend:
cd /app/frontend
vercel

# Настройте переменные окружения в Vercel Dashboard
```

#### 4.2 Backend на Railway
```bash
# Установите Railway CLI
npm install -g @railway/cli

# В папке backend:
cd /app/backend
railway login
railway init
railway up
```

## Этап 5: Настройка домена

### 5.1 Покупка домена
Рекомендуемые регистраторы:
- **REG.RU** (российский)
- **Namecheap** (международный)
- **Cloudflare** (с защитой)

### 5.2 Настройка DNS
Добавьте DNS записи:

```
A record: @ → IP_вашего_сервера
A record: www → IP_вашего_сервера
CNAME: admin → yourdomain.com
```

### 5.3 SSL сертификат (HTTPS)
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Этап 6: Мониторинг и обслуживание

### 6.1 Логирование
```bash
# Просмотр логов Backend
pm2 logs silis-backend

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Логи MongoDB
sudo tail -f /var/log/mongodb/mongod.log
```

### 6.2 Бэкапы
```bash
# Бэкап MongoDB
mongodump --db silis_center --out /backup/$(date +%Y%m%d)

# Автоматический бэкап (добавить в cron)
0 2 * * * mongodump --db silis_center --out /backup/$(date +\%Y\%m\%d)
```

### 6.3 Обновления
```bash
# Обновление кода
cd /var/www/silis
git pull

# Перезапуск backend
pm2 restart silis-backend

# Пересборка frontend
cd frontend
npm run build
sudo cp -r build/* /var/www/html/
```

## Этап 7: Тестирование продакшена

### 7.1 Чеклист проверки
- [ ] Сайт открывается по домену
- [ ] HTTPS работает (зеленый замок)
- [ ] Форма КП отправляется
- [ ] Email уведомления приходят
- [ ] Админ панель работает (/admin)
- [ ] Можно редактировать контенты
- [ ] Новости добавляются/редактируются
- [ ] Мобильная версия работает

### 7.2 Performance оптимизация
```bash
# Сжатие в Nginx
sudo nano /etc/nginx/nginx.conf

# Добавьте в http блок:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## Этап 8: SEO и аналитика

### 8.1 Google Analytics
Добавьте код в `/app/frontend/public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 8.2 Yandex Metrika
Добавьте код Яндекс.Метрики для российской аудитории

### 8.3 Sitemap и robots.txt
Создайте файлы в `/app/frontend/public/`:

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://yourdomain.com/sitemap.xml
```

**sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/#contacts</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 🎯 Итоговый чеклист готовности

### Технические требования ✅
- [ ] Сервер настроен и работает
- [ ] База данных MongoDB запущена
- [ ] Email отправка настроена
- [ ] HTTPS сертификат установлен
- [ ] Домен направлен на сервер
- [ ] Бэкапы настроены

### Контент и данные ✅
- [ ] Админ пароль изменен
- [ ] Контактная информация актуальна
- [ ] Пакеты услуг настроены
- [ ] Первые новости добавлены
- [ ] Тестовые заявки проверены

### Безопасность ✅
- [ ] Файрвол настроен
- [ ] Логирование включено
- [ ] Регулярные обновления настроены
- [ ] Мониторинг работает

---

## 💡 Рекомендации по запуску

1. **Начните с простого:** Используйте Emergent Platform для быстрого старта
2. **Тестируйте все:** Проверьте каждую функцию перед анонсом
3. **Подготовьте контент:** Добавьте реальные новости и информацию
4. **Настройте аналитику:** Отслеживайте посетителей с первого дня
5. **Сделайте резервные копии:** Настройте автоматические бэкапы

**После запуска у вас будет полноценный сайт центра "Силис" готовый принимать клиентов! 🚀**