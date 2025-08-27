import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    comment: '',
    agree: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      setSubmitStatus({ type: 'error', message: 'Необходимо согласие на обработку данных' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await axios.post(`${API}/contact-form`, formData);
      
      if (response.data.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: response.data.message || 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.' 
        });
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          organization: '',
          comment: '',
          agree: false
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'Произошла ошибка при отправке заявки. Попробуйте позже.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kp-form" className="py-20 bg-[#0E3F2B] relative overflow-hidden">
      {/* Decorative roots pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1200 400" className="w-full h-full animate-roots-flow">
          <defs>
            <pattern id="form-roots" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <path d="M150 0 Q130 75 110 150 Q90 225 70 300 M150 0 Q170 75 190 150 Q210 225 230 300" 
                    stroke="#7DB68C" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#form-roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Получить коммерческое предложение
          </h2>
          <p className="text-xl text-[#7DB68C] max-w-3xl mx-auto">
            Заполните форму, и мы подготовим персональное предложение для ваших задач
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-[#333333] font-medium mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] focus:border-transparent transition-all duration-200"
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-[#333333] font-medium mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] focus:border-transparent transition-all duration-200"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-[#333333] font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-[#333333] font-medium mb-2">
                  Организация
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] focus:border-transparent transition-all duration-200"
                  placeholder="Название организации"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="comment" className="block text-[#333333] font-medium mb-2">
                Комментарий
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Расскажите подробнее о ваших потребностях..."
              ></textarea>
            </div>

            <div className="mb-8">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-[#7DB68C] border border-[#EDE6D6] rounded focus:ring-[#7DB68C] focus:ring-2"
                />
                <span className="text-[#333333] text-sm leading-relaxed">
                  Я согласен(а) на обработку персональных данных и получение коммерческих предложений
                </span>
              </label>
            </div>

            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !formData.agree}
              className="w-full bg-[#0E3F2B] text-white py-4 px-6 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Отправляем...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Получить КП</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;