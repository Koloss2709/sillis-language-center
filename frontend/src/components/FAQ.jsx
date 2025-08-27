import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { mockFAQ } from '../mockData';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#EDE6D6]/30 relative">
      {/* Tree roots divider */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1200 150" className="w-full h-full">
          <g className="animate-roots-flow">
            <path d="M500 0 Q480 40 460 80 Q440 120 420 150 M700 0 Q720 40 740 80 Q760 120 780 150" 
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
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Ответы на популярные вопросы о наших услугах
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {mockFAQ.map((item, index) => (
            <div key={item.id} 
                 className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 animate-fade-in-up animation-delay-${(index + 1) * 100}`}>
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#EDE6D6]/30 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-[#0E3F2B] pr-4">
                  {item.question}
                </h3>
                {openItems.has(item.id) ? (
                  <ChevronUp className="text-[#7DB68C] flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-[#7DB68C] flex-shrink-0" size={24} />
                )}
              </button>
              
              {openItems.has(item.id) && (
                <div className="px-8 pb-6">
                  <div className="border-t border-[#EDE6D6] pt-4">
                    <p className="text-[#333333] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-[#333333] mb-6">
            Не нашли ответ на свой вопрос?
          </p>
          <a
            href="#contacts"
            className="text-[#0E3F2B] hover:text-[#7DB68C] font-semibold text-lg transition-colors duration-200"
          >
            Задайте его нам напрямую →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;