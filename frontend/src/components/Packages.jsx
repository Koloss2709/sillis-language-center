import React from 'react';
import { Check, Star } from 'lucide-react';
import { mockPackages } from '../mockData';

const Packages = () => {
  return (
    <section id="packages" className="py-20 relative bg-gradient-to-b from-[#EDE6D6]/30 to-white">
      {/* Tree roots divider */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1200 150" className="w-full h-full">
          <g className="animate-roots-flow">
            <path d="M400 0 Q380 40 360 80 Q340 120 320 150 M800 0 Q820 40 840 80 Q860 120 880 150" 
                  stroke="#0E3F2B" 
                  strokeWidth="3" 
                  fill="none" 
                  opacity="0.3"
                  className="animate-roots-grow"/>
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B] mb-6">
            Пакеты услуг
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Выберите оптимальный формат сотрудничества для ваших задач
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockPackages.map((pkg, index) => (
            <div key={pkg.id} 
                 className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 200} ${
                   pkg.popular ? 'ring-2 ring-[#7DB68C] transform scale-105' : ''
                 }`}>
              
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#7DB68C] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star size={16} />
                    <span>Популярный</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#0E3F2B] mb-4">
                  {pkg.name}
                </h3>
                <p className="text-[#333333] leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="text-[#7DB68C] flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-[#333333]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0E3F2B] mb-4">
                  Стоимость по запросу
                </div>
                <a
                  href="#kp-form"
                  className={`inline-block w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    pkg.popular 
                      ? 'bg-[#0E3F2B] text-white hover:bg-[#7DB68C]' 
                      : 'border-2 border-[#0E3F2B] text-[#0E3F2B] hover:bg-[#0E3F2B] hover:text-white'
                  }`}
                >
                  Получить КП
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#AAAAAA] mb-4">
            Не нашли подходящий пакет? Мы создадим индивидуальное предложение
          </p>
          <a
            href="#contacts"
            className="text-[#0E3F2B] hover:text-[#7DB68C] font-semibold transition-colors duration-200"
          >
            Связаться с нами →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Packages;