import React from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle, MessageSquare } from 'lucide-react';
import { useSiteData } from './DataProvider';

const Contacts = () => {
  const { contacts } = useSiteData();

  return (
    <section id="contacts" className="py-20 bg-gradient-to-b from-[#EDE6D6]/30 to-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B] mb-6">
            Контакты
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Свяжитесь с нами удобным для вас способом
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift">
              <h3 className="text-2xl font-bold text-[#0E3F2B] mb-6">
                Информация для связи
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#0E3F2B] p-3 rounded-xl flex-shrink-0">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0E3F2B] mb-1">Email</h4>
                    <a 
                      href={`mailto:${contacts.email}`}
                      className="text-[#333333] hover:text-[#7DB68C] transition-colors duration-200"
                    >
                      {contacts.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#0E3F2B] p-3 rounded-xl flex-shrink-0">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0E3F2B] mb-1">Телефоны</h4>
                    <div className="space-y-1">
                      {contacts.phones?.map((phone, index) => (
                        <div key={index}>
                          <a 
                            href={`tel:${phone.replace(/\s/g, '')}`}
                            className="text-[#333333] hover:text-[#7DB68C] transition-colors duration-200 block"
                          >
                            {phone}
                          </a>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-3 mt-3">
                      <a 
                        href={`tel:${contacts.phones?.[0]?.replace(/\s/g, '') || ''}`}
                        className="bg-[#7DB68C] text-white px-4 py-2 rounded-lg hover:bg-[#0E3F2B] transition-all duration-300 font-medium flex items-center space-x-2"
                      >
                        <Phone size={16} />
                        <span>Позвонить</span>
                      </a>
                      <a 
                        href="https://wa.me/79649767660"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 font-medium flex items-center space-x-2"
                      >
                        <MessageSquare size={16} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#0E3F2B] p-3 rounded-xl flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0E3F2B] mb-1">Адрес</h4>
                    <p className="text-[#333333] leading-relaxed">
                      {contacts.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift">
              <h3 className="text-2xl font-bold text-[#0E3F2B] mb-6">
                Социальные сети
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <a
                  href={`https://instagram.com/${contacts.social?.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200"
                >
                  <Instagram size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>

                <a
                  href={contacts.social?.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200"
                >
                  <MessageCircle size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">Telegram</span>
                </a>

                <a
                  href={contacts.social?.vk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-6 h-6 mx-auto mb-2 bg-white text-blue-600 rounded text-sm font-bold flex items-center justify-center">
                    VK
                  </div>
                  <span className="text-sm font-medium">VKontakte</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map or Additional Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#0E3F2B] mb-6">
              Как нас найти
            </h3>
            
            <div className="bg-[#EDE6D6] rounded-xl h-64 flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="text-[#7DB68C] mx-auto mb-4" size={48} />
                <p className="text-[#333333] font-medium">
                  Интерактивная карта
                </p>
                <p className="text-[#AAAAAA] text-sm">
                  ТЦ НОРД, 4 этаж
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#0E3F2B]">
                Время работы:
              </h4>
              <div className="text-[#333333] space-y-2">
                <div className="flex justify-between">
                  <span>Понедельник - Пятница</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Суббота</span>
                  <span className="font-medium">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Воскресенье</span>
                  <span className="font-medium">Выходной</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[#EDE6D6]/50 rounded-xl">
              <p className="text-[#333333] text-sm leading-relaxed">
                <strong>Владелец:</strong> Индивидуальный Предприниматель Николаева Дилара Николаевна<br />
                <strong>ОГРНИП:</strong> № 323140000030294<br />
                <strong>ИНН:</strong> 141901605717
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-[#333333] mb-6 text-lg">
            Готовы начать сотрудничество?
          </p>
          <a
            href="#kp-form"
            className="bg-[#0E3F2B] text-white px-8 py-4 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold text-lg inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span>Получить консультацию</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contacts;