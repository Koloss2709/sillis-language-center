import React from 'react';
import { Award, Users, Clock, Shield } from 'lucide-react';

const WhyUs = () => {
  const advantages = [
    {
      icon: Award,
      title: "Профессиональная экспертиза",
      description: "Наши специалисты имеют многолетний опыт работы с якутским языком и глубокое понимание культурных особенностей"
    },
    {
      icon: Users,
      title: "Индивидуальный подход",
      description: "Разрабатываем персонализированные решения для каждого клиента с учетом специфики деятельности"
    },
    {
      icon: Clock,
      title: "Оперативность исполнения",
      description: "Соблюдаем согласованные сроки и предоставляем услуги срочного перевода при необходимости"
    },
    {
      icon: Shield,
      title: "Гарантия качества",
      description: "Обеспечиваем высокое качество переводов и полную конфиденциальность работы с документами"
    }
  ];

  return (
    <section className="py-20 bg-[#0E3F2B] relative overflow-hidden">
      {/* Decorative roots pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1200 400" className="w-full h-full animate-roots-flow">
          <defs>
            <pattern id="whyus-roots" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <path d="M150 0 Q130 75 110 150 Q90 225 70 300 M150 0 Q170 75 190 150 Q210 225 230 300" 
                    stroke="#7DB68C" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#whyus-roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Почему выбирают «Силис»
          </h2>
          <p className="text-xl text-[#7DB68C] max-w-3xl mx-auto">
            Мы создаем мосты между культурами и языками, обеспечивая эффективное взаимодействие
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div key={index} 
                   className={`text-center animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
                <div className="bg-[#7DB68C] w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto hover-lift">
                  <IconComponent className="text-[#0E3F2B]" size={36} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">
                  {advantage.title}
                </h3>
                
                <p className="text-[#7DB68C] leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;