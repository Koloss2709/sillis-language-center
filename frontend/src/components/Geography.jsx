import React, { useState } from 'react';
import { MapPin, Users, Globe } from 'lucide-react';
import { mockCities } from '../mockData';

const Geography = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const totalStudents = mockCities.reduce((sum, city) => sum + city.students, 0);

  return (
    <section className="py-20 bg-[#0E3F2B] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1200 400" className="w-full h-full animate-roots-flow">
          <defs>
            <pattern id="geography-roots" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              <path d="M200 0 Q180 100 160 200 Q140 300 120 400 M200 0 Q220 100 240 200 Q260 300 280 400" 
                    stroke="#7DB68C" 
                    strokeWidth="2" 
                    fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geography-roots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Globe className="text-[#7DB68C]" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Наша география
            </h2>
          </div>
          <p className="text-xl text-[#7DB68C] max-w-3xl mx-auto mb-8">
            Наши ученики изучают якутский язык по всему миру
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2 text-white">
              <Users size={24} />
              <span className="text-2xl font-bold">{totalStudents}</span>
              <span className="text-[#7DB68C]">учеников по всему миру</span>
            </div>
          </div>
        </div>

        {/* Interactive World Map Representation */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <div className="relative w-full h-96 overflow-hidden rounded-2xl bg-gradient-to-b from-[#7DB68C]/20 to-[#0E3F2B]/20">
            {/* Stylized world map with cities */}
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Simplified world map outline */}
              <path d="M100 200 Q200 150 300 200 Q400 180 500 200 Q600 190 700 200" 
                    stroke="#7DB68C" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.3"/>
              
              {/* City markers */}
              {mockCities.map((city, index) => {
                // Simplified positioning for demo
                const positions = [
                  { x: 380, y: 180 }, // Алматы
                  { x: 500, y: 160 }, // Пекин
                  { x: 300, y: 120 }, // СПб
                  { x: 290, y: 140 }, // Москва
                  { x: 150, y: 160 }, // Нью-Йорк
                  { x: 580, y: 140 }, // Южно-Сахалинск
                  { x: 520, y: 120 }, // Якутск
                  { x: 480, y: 110 }  // Мирный
                ];
                
                const pos = positions[index] || { x: 400, y: 200 };
                
                return (
                  <g key={city.name} className="cursor-pointer hover:scale-110 transition-transform duration-200">
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={Math.max(8, Math.min(20, city.students / 8))}
                      fill="#7DB68C"
                      stroke="#fff"
                      strokeWidth="2"
                      className="animate-pulse"
                      onClick={() => handleCityClick(city)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 35}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      className="drop-shadow"
                    >
                      {city.name}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 50}
                      textAnchor="middle"
                      fill="#7DB68C"
                      fontSize="10"
                    >
                      {city.students} уч.
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* City details popup */}
          {selectedCity && (
            <div className="absolute top-4 right-4 bg-white rounded-xl p-6 shadow-2xl max-w-xs animate-fade-in-up">
              <button
                onClick={() => setSelectedCity(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-[#0E3F2B]" size={24} />
                <div>
                  <h4 className="font-bold text-[#0E3F2B]">{selectedCity.name}</h4>
                  <p className="text-sm text-gray-600">{selectedCity.country}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="text-[#7DB68C]" size={16} />
                <span className="text-[#333333]">{selectedCity.students} учеников</span>
              </div>
            </div>
          )}
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mockCities.map((city, index) => (
            <div key={city.name} 
                 className={`bg-white/10 backdrop-blur-md rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer hover-lift animate-fade-in-up animation-delay-${(index + 1) * 100}`}
                 onClick={() => handleCityClick(city)}>
              <MapPin className="text-[#7DB68C] mx-auto mb-2" size={24} />
              <h4 className="font-bold text-white mb-1">{city.name}</h4>
              <p className="text-[#7DB68C] text-sm mb-2">{city.country}</p>
              <div className="flex items-center justify-center space-x-1 text-white text-sm">
                <Users size={14} />
                <span>{city.students}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Хотите присоединиться к нашему международному сообществу?
            </h3>
            <p className="text-[#7DB68C] mb-6">
              Независимо от того, где вы находитесь, мы поможем вам изучить якутский язык
            </p>
            <a
              href="#kp-form"
              className="bg-[#7DB68C] text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#0E3F2B] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Начать изучение онлайн
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Geography;