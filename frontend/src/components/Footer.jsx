import React from 'react';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { mockContacts } from '../mockData';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { label: 'Услуги', href: '#services' },
    { label: 'О нас', href: '#about' },
    { label: 'Пакеты', href: '#packages' },
    { label: 'Новости', href: '#news' },
    { label: 'Контакты', href: '#contacts' },
    { label: 'Получить КП', href: '#kp-form' }
  ];

  return (
    <footer className="bg-[#0E3F2B] text-white relative overflow-hidden">
      {/* Decorative roots pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1200 300" className="w-full h-full">
          <defs>
            <pattern id="footer-roots" x="0" y="0" width="400" height="300" patternUnits="userSpaceOnUse">
              <path d="M200 0 Q180 75 160 150 Q140 225 120 300 M200 0 Q220 75 240 150 Q260 225 280 300" 
                    stroke="#7DB68C" 
                    strokeWidth="1" 
                    fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_c8706acf-6165-4cd7-8d7f-004f27bb046b/artifacts/nayanc7r_%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20WhatsApp%202025-08-25%20%D0%B2%2008.48.36_4f8baf5a-Photoroom.png"
                alt="Центр якутского языка Силис" 
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Силис</h3>
                <p className="text-[#7DB68C] text-sm">Центр якутского языка</p>
              </div>
            </div>
            <p className="text-[#7DB68C] leading-relaxed mb-6">
              Профессиональная лингвистическая адаптация для эффективной работы 
              в Республике Саха (Якутия)
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">
              Быстрые ссылки
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-[#7DB68C] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">
              Контакты
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="text-[#7DB68C] flex-shrink-0 mt-0.5" size={18} />
                <a 
                  href={`mailto:${mockContacts.email}`}
                  className="text-[#7DB68C] hover:text-white transition-colors duration-200"
                >
                  {mockContacts.email}
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="text-[#7DB68C] flex-shrink-0 mt-0.5" size={18} />
                <div>
                  {mockContacts.phones.map((phone, index) => (
                    <a 
                      key={index}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-[#7DB68C] hover:text-white transition-colors duration-200 block"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="text-[#7DB68C] flex-shrink-0 mt-0.5" size={18} />
                <p className="text-[#7DB68C]">
                  {mockContacts.address}
                </p>
              </div>
            </div>
          </div>

          {/* Social & CTA */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">
              Мы в соцсетях
            </h4>
            <div className="flex space-x-3 mb-6">
              <a
                href={`https://instagram.com/${mockContacts.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7DB68C] text-white p-2 rounded-lg hover:bg-white hover:text-[#0E3F2B] transition-all duration-200"
              >
                IG
              </a>
              <a
                href={mockContacts.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7DB68C] text-white p-2 rounded-lg hover:bg-white hover:text-[#0E3F2B] transition-all duration-200"
              >
                TG
              </a>
              <a
                href={mockContacts.social.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7DB68C] text-white p-2 rounded-lg hover:bg-white hover:text-[#0E3F2B] transition-all duration-200"
              >
                VK
              </a>
            </div>

            <a
              href="#kp-form"
              className="inline-block bg-[#7DB68C] text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#0E3F2B] transition-all duration-300 font-semibold"
            >
              Получить КП
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#7DB68C]/30 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[#7DB68C] text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Центр якутского языка «Силис». Все права защищены.
          </p>
          
          <button
            onClick={scrollToTop}
            className="bg-[#7DB68C] text-white p-3 rounded-full hover:bg-white hover:text-[#0E3F2B] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;