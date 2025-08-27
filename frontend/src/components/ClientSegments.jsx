import React from 'react';
import { Users, Building, Heart, Target } from 'lucide-react';

const ClientSegments = () => {
  const segments = [
    {
      id: 'b2c',
      icon: Heart,
      title: 'Для детей и родителей',
      subtitle: '',
      pains: [
        'Трудности с сохранением языка в семье',
        'Непонимание школьных материалов на якутском',
        'Нехватка уверенности у детей при общении',
        'Барьеры в коммуникации с педагогами'
      ],
      solutions: [
        'Адаптация учебных материалов для детей',
        'Обучение родителей основам языка',
        'Поддержка культурной идентичности',
        'Мостик между семьей и школой'
      ],
      utp: 'Ваши дети уверенно говорят и понимают, родители получают ясные инструкции',
      bgColor: 'bg-gradient-to-br from-[#EDE6D6] to-white'
    },
    {
      id: 'b2b',
      icon: Building,
      title: 'Для компаний и органов власти',
      subtitle: '',
      pains: [
        'Ошибки в официальных переводах документов',
        'Непонимание культурных нюансов в бизнесе',
        'Формальная коммуникация вызывает недоверие',
        'Потеря клиентов из-за языковых барьеров'
      ],
      solutions: [
        'Корректный перевод деловых документов',
        'Создание специализированных глоссариев',
        'Деловые тренинги и семинары',
        'Сопровождение переговоров и встреч'
      ],
      utp: 'Точные переводы, эффективные коммуникации, уважение к культурным нормам',
      bgColor: 'bg-gradient-to-br from-white to-[#EDE6D6]'
    }
  ];

  return (
    <section id="segments" className="py-20 relative">
      {/* Tree roots divider */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
        <svg viewBox="0 0 1200 100" className="w-full h-full">
          <path d="M0 50 Q200 20 400 50 T800 50 T1200 50 L1200 100 L0 100 Z" 
                fill="#0E3F2B" 
                opacity="0.1"/>
          <path d="M600 0 Q580 25 560 50 Q540 75 520 100 M600 0 Q620 25 640 50 Q660 75 680 100" 
                stroke="#0E3F2B" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.2"/>
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B] mb-6">
            Наши клиенты
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Мы работаем с разными сегментами, понимая уникальные потребности каждого
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {segments.map((segment) => {
            const IconComponent = segment.icon;
            return (
              <div key={segment.id} className={`${segment.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-[#0E3F2B] p-3 rounded-xl">
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0E3F2B] mb-2">
                      {segment.title}
                    </h3>
                    <p className="text-[#7DB68C] font-semibold">{segment.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Pains */}
                  <div>
                    <h4 className="font-semibold text-[#333333] mb-3 flex items-center">
                      <Target className="text-[#0E3F2B] mr-2" size={20} />
                      Проблемы клиентов:
                    </h4>
                    <ul className="space-y-2">
                      {segment.pains.map((pain, index) => (
                        <li key={index} className="text-[#333333] flex items-start">
                          <span className="text-[#AAAAAA] mr-2">•</span>
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h4 className="font-semibold text-[#333333] mb-3 flex items-center">
                      <Users className="text-[#7DB68C] mr-2" size={20} />
                      Наши решения:
                    </h4>
                    <ul className="space-y-2">
                      {segment.solutions.map((solution, index) => (
                        <li key={index} className="text-[#333333] flex items-start">
                          <span className="text-[#7DB68C] mr-2">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* UTP */}
                  <div className="bg-white/50 p-4 rounded-xl border-l-4 border-[#0E3F2B]">
                    <h4 className="font-semibold text-[#0E3F2B] mb-2">Результат:</h4>
                    <p className="text-[#333333] font-medium">{segment.utp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientSegments;