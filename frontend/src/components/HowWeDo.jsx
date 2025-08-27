import React from 'react';
import { BookOpen, Users, GraduationCap, Heart, Sparkles } from 'lucide-react';

const HowWeDo = () => {
  const methods = [
    {
      icon: BookOpen,
      title: "Учим языку",
      description: "через современные программы для детей и взрослых",
      color: "bg-[#0E3F2B]"
    },
    {
      icon: Users,
      title: "Объединяем",
      description: "в разговорных клубах и проектных мероприятиях",
      color: "bg-[#7DB68C]"
    },
    {
      icon: GraduationCap,
      title: "Поддерживаем педагогов",
      description: "бесплатными семинарами и методиками",
      color: "bg-[#0E3F2B]"
    },
    {
      icon: Heart,
      title: "Вдохновляем семьи",
      description: "вебинарами для родителей о важности родного языка",
      color: "bg-[#7DB68C]"
    },
    {
      icon: Sparkles,
      title: "Говорим с молодежью",
      description: "через проекты, где подростки учат язык через творчество, технологии и общение",
      color: "bg-[#0E3F2B]"
    }
  ];

  return (
    <section className="py-20 bg-[#0E3F2B] relative overflow-hidden">
      {/* Decorative roots pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1200 400" className="w-full h-full animate-roots-flow">
          <defs>
            <pattern id="howwedo-roots" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <path d="M150 0 Q130 75 110 150 Q90 225 70 300 M150 0 Q170 75 190 150 Q210 225 230 300" 
                    stroke="#7DB68C" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#howwedo-roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Как мы это делаем?
          </h2>
          <p className="text-xl text-[#7DB68C] max-w-3xl mx-auto">
            Наш комплексный подход к сохранению и развитию якутского языка
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {methods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} 
                   className={`bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 100} ${
                     index === 4 ? 'lg:col-span-3 lg:max-w-2xl lg:mx-auto' : ''
                   }`}>
                
                <div className={`${method.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <IconComponent className="text-white" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-[#0E3F2B] mb-4">
                  {method.title}
                </h3>
                
                <p className="text-[#333333] leading-relaxed">
                  {method.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Присоединяйтесь к нашему сообществу
            </h3>
            <p className="text-[#7DB68C] mb-6">
              Станьте частью движения по сохранению якутского языка и культуры
            </p>
            <a
              href="#kp-form"
              className="bg-white text-[#0E3F2B] px-8 py-4 rounded-lg hover:bg-[#7DB68C] hover:text-white transition-all duration-300 font-semibold text-lg inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Начать обучение</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeDo;