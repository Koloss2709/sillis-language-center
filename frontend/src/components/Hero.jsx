import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  const benefits = [
    "Профессиональная лингвистическая адаптация",
    "Эффективная работа в Республике Саха (Якутия)",
    "Уважение к культурным традициям"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#EDE6D6]/30">
      {/* Tree roots SVG background */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <svg viewBox="0 0 1200 800" className="w-full h-full animate-roots-flow">
          <defs>
            <pattern id="roots" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              <path d="M200 0 Q160 100 120 200 Q80 300 40 400 M200 0 Q240 100 280 200 Q320 300 360 400 M200 100 Q180 200 160 300 Q140 360 120 400 M200 100 Q220 200 240 300 Q260 360 280 400" 
                    stroke="#0E3F2B" 
                    strokeWidth="3" 
                    fill="none" 
                    className="animate-roots-grow"/>
              <path d="M100 200 Q90 250 80 300 Q70 350 60 400 M300 200 Q310 250 320 300 Q330 350 340 400" 
                    stroke="#7DB68C" 
                    strokeWidth="2" 
                    fill="none" 
                    className="animate-roots-grow animation-delay-200"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-[#0E3F2B] mb-6 leading-tight animate-fade-in-up">
            Говорите на якутском 
            <span className="block text-[#7DB68C]">с уверенностью</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-[#333333] mb-8 animate-fade-in-up animation-delay-200">
            Комплексная лингвистическая адаптация для эффективной работы 
            в Республике Саха (Якутия)
          </p>

          {/* Benefits */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12 animate-fade-in-up animation-delay-400">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="text-[#7DB68C] flex-shrink-0" size={24} />
                <span className="text-[#333333] font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animation-delay-600">
            <a
              href="#kp-form"
              className="bg-[#0E3F2B] text-white px-8 py-4 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl group flex items-center space-x-2"
            >
              <span>Получить КП</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </a>
            <a
              href="#contacts"
              className="border-2 border-[#0E3F2B] text-[#0E3F2B] px-8 py-4 rounded-lg hover:bg-[#0E3F2B] hover:text-white transition-all duration-300 font-semibold text-lg"
            >
              Задать вопрос
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#0E3F2B] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#0E3F2B] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;