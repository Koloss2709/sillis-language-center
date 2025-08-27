import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Fallback data in case API fails
const fallbackData = {
  contacts: {
    email: "silisykt@mail.ru",
    phones: ["8 914 287 0753", "8 964 076 7660"],
    address: "г. Якутск, ул. Лермонтова 47, ТЦ НОРД, 4 этаж",
    social: {
      instagram: "silis_school",
      telegram: "https://t.me/silisschool",
      vk: "https://vk.com/siliscenter"
    }
  },
  packages: {
    b2c: [
      {
        id: 1,
        name: "Интенсивы",
        description: "Быстрое погружение в язык",
        features: ["Групповые занятия 3 раза в неделю", "Разговорная практика", "Домашние задания", "Поддержка преподавателя"],
        popular: false,
        freeLesson: true
      },
      {
        id: 2,
        name: "Частные занятия",
        description: "Индивидуальный подход",
        features: ["Персональный преподаватель", "Гибкий график", "Индивидуальная программа", "Быстрый прогресс"],
        popular: true,
        freeLesson: true
      },
      {
        id: 3,
        name: "Вебинары",
        description: "Онлайн обучение",
        features: ["Доступ из любой точки мира", "Записи занятий", "Интерактивные материалы", "Сертификат участника"],
        popular: false,
        freeLesson: true
      }
    ],
    b2b: [
      {
        id: 1,
        name: "Старт",
        description: "Базовое сопровождение",
        features: ["Консультация специалиста", "Базовый перевод документов", "Email поддержка"],
        popular: false
      },
      {
        id: 2,
        name: "Стандарт",
        description: "Комплексное сопровождение",
        features: ["Все из пакета Старт", "Деловые тренинги", "Телефонная поддержка", "Культурное консультирование"],
        popular: true
      },
      {
        id: 3,
        name: "Премиум",
        description: "Полное сопровождение",
        features: ["Все из пакета Стандарт", "Персональный менеджер", "Срочные переводы", "Выездные тренинги"],
        popular: false
      }
    ]
  }
};

// Create context
const DataContext = createContext();

// Data Provider component
export const DataProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API}/content`);
      setSiteData(response.data);
      
      console.log('Site data loaded from API:', response.data);
    } catch (err) {
      console.error('Error fetching site data:', err);
      setError(err);
      
      // Use fallback data on error
      setSiteData(fallbackData);
      console.log('Using fallback data due to API error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  const refreshData = () => {
    fetchSiteData();
  };

  const value = {
    siteData,
    loading,
    error,
    refreshData,
    contacts: siteData.contacts,
    packages: siteData.packages
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use the data context
export const useSiteData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a DataProvider');
  }
  return context;
};

// Loading component
export const DataLoader = ({ children, fallback }) => {
  const { loading } = useSiteData();
  
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E3F2B] mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем данные...</p>
        </div>
      </div>
    );
  }
  
  return children;
};