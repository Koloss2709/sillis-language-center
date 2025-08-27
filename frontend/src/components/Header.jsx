import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Услуги', href: '#services' },
    { label: 'О нас', href: '#about' },
    { label: 'Пакеты', href: '#packages' },
    { label: 'Новости', href: '#news' },
    { label: 'Контакты', href: '#contacts' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_c8706acf-6165-4cd7-8d7f-004f27bb046b/artifacts/nayanc7r_%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20WhatsApp%202025-08-25%20%D0%B2%2008.48.36_4f8baf5a-Photoroom.png"
              alt="Центр якутского языка Силис" 
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-xl font-bold text-[#0E3F2B]">Силис</h1>
              <p className="text-sm text-[#AAAAAA]">Центр якутского языка</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#333333] hover:text-[#0E3F2B] transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <a
              href="#kp-form"
              className="bg-[#0E3F2B] text-white px-6 py-3 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Получить КП
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#0E3F2B]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-[#EDE6D6]">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#333333] hover:text-[#0E3F2B] transition-colors duration-200 font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#kp-form"
                onClick={() => setIsMenuOpen(false)}
                className="bg-[#0E3F2B] text-white px-6 py-3 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-medium text-center"
              >
                Получить КП
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;