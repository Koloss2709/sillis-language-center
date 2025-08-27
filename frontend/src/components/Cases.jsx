import React from 'react';
import { School, Building2, Users } from 'lucide-react';
import { mockCases } from '../mockData';

const Cases = () => {
  const iconMap = {
    0: School,
    1: Building2,
    2: Users
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B] mb-6">
            Сценарии применения
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Реальные примеры того, как наши решения помогают клиентам достигать целей
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mockCases.map((caseItem, index) => {
            const IconComponent = iconMap[index];
            return (
              <div key={caseItem.id} 
                   className={`bg-gradient-to-br from-[#EDE6D6] to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
                
                <div className="bg-[#0E3F2B] w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="text-white" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-[#0E3F2B] mb-4">
                  {caseItem.title}
                </h3>
                
                <p className="text-[#333333] mb-6 leading-relaxed">
                  {caseItem.description}
                </p>
                
                <div className="bg-white/50 p-4 rounded-xl border-l-4 border-[#7DB68C]">
                  <h4 className="font-semibold text-[#0E3F2B] mb-2">Результат:</h4>
                  <p className="text-[#333333] font-medium">{caseItem.result}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-[#333333] mb-6 text-lg">
            Хотите узнать, как наши услуги помогут именно вам?
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

export default Cases;