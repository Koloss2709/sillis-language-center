import React from 'react';
import { Award, Lightbulb, BookHeart, DollarSign, Smile } from 'lucide-react';

const Values = () => {
  const values = [
    {
      icon: Award,
      title: "Качество",
      description: "Мы гарантируем высокое качество преподавания и индивидуальный подход к каждому ученику."
    },
    {
      icon: Lightbulb,
      title: "Инновации",
      description: "Мы используем современные методики и технологии для повышения эффективности обучения."
    },
    {
      icon: BookHeart,
      title: "Культура",
      description: "Мы не только учим языку, но и знакомим с якутской культурой, традициями и литературой."
    },
    {
      icon: DollarSign,
      title: "Доступность",
      description: "Мы стремимся сделать обучение доступным для всех, предлагая гибкие варианты оплаты."
    },
    {
      icon: Smile,
      title: "Дружелюбная атмосфера",
      description: "Мы создаем комфортную и поддерживающую среду для общения и обучения."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#EDE6D6]/30 to-white relative">
      {/* Tree roots divider */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1200 150" className="w-full h-full">
          <g className="animate-roots-flow">
            <path d="M300 0 Q280 40 260 80 Q240 120 220 150 M900 0 Q920 40 940 80 Q960 120 980 150" 
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
            Наши ценности
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Принципы, которые направляют нашу деятельность и определяют качество обучения
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} 
                   className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 100} ${
                     index === 4 ? 'lg:col-span-3 lg:max-w-2xl lg:mx-auto' : ''
                   }`}>
                
                <div className="bg-[#0E3F2B] w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="text-white" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-[#0E3F2B] mb-4">
                  {value.title}
                </h3>
                
                <p className="text-[#333333] leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#0E3F2B] to-[#7DB68C] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Эти ценности делают нас уникальными
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Присоединяйтесь к нам и почувствуйте разницу в подходе к изучению языка
            </p>
            <a
              href="#kp-form"
              className="bg-white text-[#0E3F2B] px-8 py-4 rounded-lg hover:bg-[#EDE6D6] transition-all duration-300 font-semibold text-lg"
            >
              Попробовать бесплатный урок
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;