import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from models import EmailData
import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_user = os.getenv('SMTP_USER', '')
        self.smtp_password = os.getenv('SMTP_PASSWORD', '')
        self.email_from = os.getenv('EMAIL_FROM', 'silisykt@mail.ru')
        self.email_to = os.getenv('EMAIL_TO', 'silisykt@mail.ru')

    def create_submission_email(self, data: EmailData) -> MIMEMultipart:
        """Создает email с данными заявки для администратора"""
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Новая заявка на КП от {data.name}'
        msg['From'] = self.email_from
        msg['To'] = self.email_to

        # HTML template for admin notification
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #0E3F2B 0%, #7DB68C 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .content {{
                    background: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #7DB68C;
                }}
                .field {{
                    margin-bottom: 15px;
                    padding: 10px;
                    background: white;
                    border-radius: 4px;
                }}
                .field-label {{
                    font-weight: bold;
                    color: #0E3F2B;
                }}
                .field-value {{
                    margin-top: 5px;
                    color: #333;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    padding: 15px;
                    background: #EDE6D6;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Новая заявка на коммерческое предложение</h2>
                <p>Центр якутского языка «Силис»</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="field-label">Имя клиента:</div>
                    <div class="field-value">{data.name}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Телефон:</div>
                    <div class="field-value">{data.phone}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value">{data.email}</div>
                </div>
                
                {f'''<div class="field">
                    <div class="field-label">Организация:</div>
                    <div class="field-value">{data.organization}</div>
                </div>''' if data.organization else ''}
                
                {f'''<div class="field">
                    <div class="field-label">Комментарий:</div>
                    <div class="field-value">{data.comment}</div>
                </div>''' if data.comment else ''}
                
                <div class="field">
                    <div class="field-label">Дата подачи заявки:</div>
                    <div class="field-value">{data.created_at.strftime('%d.%m.%Y в %H:%M')}</div>
                </div>
            </div>
            
            <div class="footer">
                <p>Это автоматическое уведомление с сайта центра «Силис»</p>
                <p>Свяжитесь с клиентом в ближайшее время для обсуждения коммерческого предложения</p>
            </div>
        </body>
        </html>
        """

        # Plain text version
        text_content = f"""
        Новая заявка на коммерческое предложение
        Центр якутского языка «Силис»
        
        Имя клиента: {data.name}
        Телефон: {data.phone}
        Email: {data.email}
        {'Организация: ' + data.organization if data.organization else ''}
        {'Комментарий: ' + data.comment if data.comment else ''}
        Дата подачи заявки: {data.created_at.strftime('%d.%m.%Y в %H:%M')}
        
        Свяжитесь с клиентом в ближайшее время для обсуждения коммерческого предложения.
        """

        # Attach both versions
        msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))

        return msg

    def create_confirmation_email(self, data: EmailData) -> MIMEMultipart:
        """Создает подтверждающий email для клиента"""
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Ваша заявка получена - Центр якутского языка «Силис»'
        msg['From'] = self.email_from
        msg['To'] = data.email

        # HTML template for client confirmation
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #0E3F2B 0%, #7DB68C 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .content {{
                    background: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                }}
                .highlight {{
                    background: #EDE6D6;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 4px solid #7DB68C;
                }}
                .contact-info {{
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    padding: 15px;
                    font-size: 14px;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Спасибо за вашу заявку!</h2>
                <p>Центр якутского языка «Силис»</p>
            </div>
            
            <div class="content">
                <p>Уважаемый(ая) {data.name}!</p>
                
                <p>Мы получили вашу заявку на коммерческое предложение и благодарим вас за интерес к нашим услугам.</p>
                
                <div class="highlight">
                    <strong>Что происходит дальше:</strong>
                    <ul>
                        <li>Наш менеджер свяжется с вами в течение рабочего дня</li>
                        <li>Мы подготовим персональное коммерческое предложение</li>
                        <li>Обсудим все детали и ответим на ваши вопросы</li>
                    </ul>
                </div>
                
                <div class="contact-info">
                    <strong>Наши контакты:</strong><br>
                    📧 Email: silisykt@mail.ru<br>
                    📞 Телефон: 8 914 287 0753, 8 964 076 7660<br>
                    📍 Адрес: г. Якутск, ул. Лермонтова 47, ТЦ НОРД, 4 этаж<br>
                    💬 WhatsApp: <a href="https://wa.me/79649767660">+7 964 976-76-60</a>
                </div>
                
                <p>С уважением,<br>
                Команда центра якутского языка «Силис»</p>
            </div>
            
            <div class="footer">
                <p>Это автоматическое сообщение. Пожалуйста, не отвечайте на него.</p>
            </div>
        </body>
        </html>
        """

        # Plain text version
        text_content = f"""
        Спасибо за вашу заявку!
        Центр якутского языка «Силис»
        
        Уважаемый(ая) {data.name}!
        
        Мы получили вашу заявку на коммерческое предложение и благодарим вас за интерес к нашим услугам.
        
        Что происходит дальше:
        - Наш менеджер свяжется с вами в течение рабочего дня
        - Мы подготовим персональное коммерческое предложение  
        - Обсудим все детали и ответим на ваши вопросы
        
        Наши контакты:
        Email: silisykt@mail.ru
        Телефон: 8 914 287 0753, 8 964 076 7660
        Адрес: г. Якутск, ул. Лермонтова 47, ТЦ НОРД, 4 этаж
        WhatsApp: +7 964 976-76-60
        
        С уважением,
        Команда центра якутского языка «Силис»
        """

        # Attach both versions
        msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))

        return msg

    async def send_submission_notification(self, data: EmailData) -> bool:
        """Отправляет уведомление администратору о новой заявке"""
        try:
            msg = self.create_submission_email(data)
            return await self._send_email(msg)
        except Exception as e:
            logger.error(f"Failed to send submission notification: {e}")
            return False

    async def send_confirmation_email(self, data: EmailData) -> bool:
        """Отправляет подтверждение клиенту"""
        try:
            msg = self.create_confirmation_email(data)
            return await self._send_email(msg)
        except Exception as e:
            logger.error(f"Failed to send confirmation email: {e}")
            return False

    async def _send_email(self, msg: MIMEMultipart) -> bool:
        """Внутренний метод для отправки email"""
        try:
            # Skip email sending in development if no SMTP configured
            if not self.smtp_user or not self.smtp_password:
                logger.info("SMTP not configured - email would be sent in production")
                logger.info(f"Email subject: {msg['Subject']}")
                logger.info(f"Email to: {msg['To']}")
                return True

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
                logger.info(f"Email sent successfully to {msg['To']}")
                return True

        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False


# Create global instance
email_service = EmailService()