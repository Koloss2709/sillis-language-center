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
    <section id="geography" className="py-20 bg-[#0E3F2B] relative overflow-hidden">
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

        {/* Interactive Professional World Map */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#7DB68C]/20 to-[#0E3F2B]/20 p-4">
            <div className="relative">
              {/* Professional World Map SVG */}
              <div className="relative w-full h-96 flex items-center justify-center">
                <img 
                  src="https://customer-assets.emergentagent.com/job_silis-yakut/artifacts/sri98wra_world.svg"
                  alt="Карта мира"
                  className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* City markers overlay */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 800 400" className="w-full h-full">
                    {/* City markers with proper positioning */}
                    {mockCities.map((city, index) => {
                      // More accurate positioning based on world coordinates
                      const positions = [
                        { x: 515, y: 180 }, // Алматы (Kazakhstan)
                        { x: 670, y: 170 }, // Пекин (China)
                        { x: 460, y: 120 }, // Санкт-Петербург (Russia)
                        { x: 465, y: 135 }, // Москва (Russia)
                        { x: 180, y: 160 }, // Нью-Йорк (USA)
                        { x: 720, y: 185 }, // Южно-Сахалинск (Russia)
                        { x: 680, y: 110 }, // Якутск (Russia)
                        { x: 630, y: 115 }  // Мирный (Russia)
                      ];
                      
                      const pos = positions[index] || { x: 400, y: 200 };
                      const pulseDelay = index * 0.5;
                      
                      return (
                        <g key={city.name} className="cursor-pointer group">
                          {/* Pulsing ring animation */}
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="20"
                            fill="none"
                            stroke="#7DB68C"
                            strokeWidth="2"
                            opacity="0.6"
                            className="animate-ping"
                            style={{animationDelay: `${pulseDelay}s`}}
                          />
                          
                          {/* Main city marker */}
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={Math.max(6, Math.min(16, city.students / 15))}
                            fill="#7DB68C"
                            stroke="white"
                            strokeWidth="3"
                            className="hover:scale-125 transition-all duration-300 drop-shadow-lg"
                            onClick={() => handleCityClick(city)}
                          />
                          
                          {/* Student count badge */}
                          <circle
                            cx={pos.x + 15}
                            cy={pos.y - 15}
                            r="12"
                            fill="white"
                            stroke="#0E3F2B"
                            strokeWidth="2"
                            className="group-hover:scale-110 transition-transform duration-200"
                          />
                          <text
                            x={pos.x + 15}
                            y={pos.y - 10}
                            textAnchor="middle"
                            fill="#0E3F2B"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {city.students}
                          </text>
                          
                          {/* City name on hover */}
                          <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <rect
                              x={pos.x - 30}
                              y={pos.y + 20}
                              width="60"
                              height="25"
                              rx="12"
                              fill="white"
                              stroke="#0E3F2B"
                              strokeWidth="1"
                              className="drop-shadow-lg"
                            />
                            <text
                              x={pos.x}
                              y={pos.y + 37}
                              textAnchor="middle"
                              fill="#0E3F2B"
                              fontSize="11"
                              fontWeight="bold"
                            >
                              {city.name}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                    
                    {/* Connection lines between cities */}
                    <g className="opacity-30">
                      <path
                        d="M515,180 Q590,150 670,170 Q675,140 680,110 Q655,112 630,115"
                        stroke="#7DB68C"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                      <path
                        d="M180,160 Q320,140 460,120 Q462,127 465,135"
                        stroke="#7DB68C"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        className="animate-pulse animation-delay-400"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* City details popup */}
            {selectedCity && (
              <div className="absolute top-4 right-4 bg-white rounded-xl p-6 shadow-2xl max-w-xs animate-fade-in-up z-10">
                <button
                  onClick={() => setSelectedCity(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="text-[#0E3F2B]" size={24} />
                  <div>
                    <h4 className="font-bold text-[#0E3F2B] text-lg">{selectedCity.name}</h4>
                    <p className="text-sm text-gray-600">{selectedCity.country}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#EDE6D6] rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="text-[#7DB68C]" size={18} />
                    <span className="text-[#333333] font-medium">{selectedCity.students} учеников</span>
                  </div>
                  <div className="text-[#0E3F2B] font-bold text-lg">
                    {Math.round((selectedCity.students / totalStudents) * 100)}%
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-[#0E3F2B] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#7DB68C] h-full rounded-full transition-all duration-1000"
                      style={{width: `${(selectedCity.students / totalStudents) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
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