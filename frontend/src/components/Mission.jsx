import React from 'react';
import { Target, Heart, Globe } from 'lucide-react';

const Mission = () => {
  return (
    <section id="mission" className="py-20 bg-gradient-to-b from-white to-[#EDE6D6]/30 relative">
      {/* Tree roots divider */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1200 150" className="w-full h-full">
          <g className="animate-roots-flow">
            <path d="M200 0 Q180 40 160 80 Q140 120 120 150 M1000 0 Q1020 40 1040 80 Q1060 120 1080 150" 
                  stroke="#0E3F2B" 
                  strokeWidth="3" 
                  fill="none" 
                  opacity="0.3"
                  className="animate-roots-grow"/>
            <path d="M600 0 Q580 40 560 80 Q540 120 520 150 M600 0 Q620 40 640 80 Q660 120 680 150" 
                  stroke="#7DB68C" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.4"
                  className="animate-roots-grow animation-delay-400"/>
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Target className="text-[#0E3F2B]" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B]">
              Наша миссия
            </h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 text-center animate-fade-in-up">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <Heart className="text-[#7DB68C] animate-float" size={40} />
              <Globe className="text-[#0E3F2B] animate-float animation-delay-200" size={40} />
            </div>
            
            <p className="text-xl md:text-2xl text-[#333333] leading-relaxed mb-8 font-medium">
              Сохранять, развивать и популяризировать якутский язык и культуру 
              Республики Саха (Якутия) через образование, живые проекты и сообщество
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center animate-fade-in-up animation-delay-200">
                <div className="bg-[#0E3F2B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">С</span>
                </div>
                <h3 className="font-bold text-[#0E3F2B] mb-2">Сохранять</h3>
                <p className="text-[#333333] text-sm">языковое наследие для будущих поколений</p>
              </div>

              <div className="text-center animate-fade-in-up animation-delay-400">
                <div className="bg-[#7DB68C] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">Р</span>
                </div>
                <h3 className="font-bold text-[#0E3F2B] mb-2">Развивать</h3>
                <p className="text-[#333333] text-sm">современные подходы к изучению языка</p>
              </div>

              <div className="text-center animate-fade-in-up animation-delay-600">
                <div className="bg-[#0E3F2B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">П</span>
                </div>
                <h3 className="font-bold text-[#0E3F2B] mb-2">Популяризировать</h3>
                <p className="text-[#333333] text-sm">культуру среди молодежи и мирового сообщества</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;