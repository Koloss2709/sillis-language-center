import React from 'react';
import { Star, Quote } from 'lucide-react';
import { mockTestimonials } from '../mockData';

const Testimonials = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#EDE6D6]/30 to-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1200 400" className="w-full h-full animate-roots-flow">
          <defs>
            <pattern id="testimonial-roots" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              <path d="M200 0 Q180 100 160 200 Q140 300 120 400 M200 0 Q220 100 240 200 Q260 300 280 400" 
                    stroke="#0E3F2B" 
                    strokeWidth="2" 
                    fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B] mb-6">
            Отзывы наших клиентов
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Узнайте, что говорят о нас родители и представители организаций
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mockTestimonials.map((testimonial, index) => (
            <div key={testimonial.id} 
                 className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 200} relative`}>
              
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4">
                <div className="bg-[#7DB68C] w-12 h-12 rounded-full flex items-center justify-center">
                  <Quote className="text-white" size={24} />
                </div>
              </div>

              {/* Stars rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-[#7DB68C] fill-current" size={20} />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-[#333333] mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Author info */}
              <div className="border-t border-[#EDE6D6] pt-6">
                <h4 className="font-semibold text-[#0E3F2B] mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-[#AAAAAA] text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-[#333333] mb-6">
            Присоединяйтесь к нашим довольным клиентам
          </p>
          <a
            href="#kp-form"
            className="border-2 border-[#0E3F2B] text-[#0E3F2B] px-8 py-4 rounded-lg hover:bg-[#0E3F2B] hover:text-white transition-all duration-300 font-semibold"
          >
            Стать нашим клиентом
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;