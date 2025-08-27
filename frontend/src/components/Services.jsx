import React from 'react';
import { FileText, MessageCircle, Mic, Heart } from 'lucide-react';
import { mockServices } from '../mockData';

const Services = () => {
  const iconMap = {
    FileText,
    MessageCircle,
    Mic,
    Heart
  };

  return (
    <section id="services" className="py-20 relative bg-gradient-to-b from-white to-[#EDE6D6]/30">
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
            <path d="M150 20 Q140 50 130 80 Q120 110 110 150 M1050 20 Q1060 50 1070 80 Q1080 110 1090 150" 
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
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B] mb-6">
            Наши услуги
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Комплексное лингвистическое сопровождение для успешной работы на якутском языке
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockServices.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div key={service.id} 
                   className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
                <div className="bg-[#0E3F2B] w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <IconComponent className="text-white" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-[#0E3F2B] text-center mb-4">
                  {service.title}
                </h3>
                
                <p className="text-[#333333] text-center mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#7DB68C] rounded-full flex-shrink-0"></div>
                      <span className="text-[#333333] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;