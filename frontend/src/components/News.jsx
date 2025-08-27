import React, { useState, useEffect } from 'react';
import { Calendar, Eye, Plus, X } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const News = () => {
  const [news, setNews] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/news?limit=50`); // Get more news for show all functionality
      setNews(response.data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to empty array if API fails
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Show only 6 latest news by default
  const visibleNews = showAllNews ? news : news.slice(0, 6);
  const hasMoreNews = news.length > 6;

  const openNewsModal = (article) => {
    setSelectedNews(article);
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
  };

  const handleAddNews = (e) => {
    e.preventDefault();
    const article = {
      id: news.length + 1,
      ...newArticle,
      image: "/api/placeholder/400/250"
    };
    setNews([article, ...news]);
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAdmin(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="news" className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0E3F2B]">
              Новости центра
            </h2>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="bg-[#7DB68C] text-white p-3 rounded-lg hover:bg-[#0E3F2B] transition-all duration-300"
            >
              <Plus size={24} />
            </button>
          </div>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Следите за нашими последними новостями и достижениями
          </p>
        </div>

        {/* Admin Panel */}
        {showAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#0E3F2B]">
                  Добавить новость
                </h3>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="text-[#AAAAAA] hover:text-[#333333] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddNews} className="space-y-6">
                <div>
                  <label className="block text-[#333333] font-medium mb-2">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C]"
                    placeholder="Введите заголовок новости"
                  />
                </div>

                <div>
                  <label className="block text-[#333333] font-medium mb-2">
                    Краткое описание
                  </label>
                  <input
                    type="text"
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C]"
                    placeholder="Краткое описание для карточки"
                  />
                </div>

                <div>
                  <label className="block text-[#333333] font-medium mb-2">
                    Полный текст
                  </label>
                  <textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] resize-none"
                    placeholder="Полный текст новости"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[#333333] font-medium mb-2">
                    Дата публикации
                  </label>
                  <input
                    type="date"
                    value={newArticle.date}
                    onChange={(e) => setNewArticle({...newArticle, date: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C]"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0E3F2B] text-white py-3 px-6 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold"
                  >
                    Добавить новость
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdmin(false)}
                    className="flex-1 border-2 border-[#EDE6D6] text-[#333333] py-3 px-6 rounded-lg hover:bg-[#EDE6D6] transition-all duration-300 font-semibold"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* News Detail Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <div className="h-64 bg-[#EDE6D6] flex items-center justify-center">
                  <Eye className="text-[#7DB68C]" size={64} />
                </div>
                <button
                  onClick={closeNewsModal}
                  className="absolute top-4 right-4 bg-white text-[#333333] p-2 rounded-full hover:bg-[#EDE6D6] transition-colors shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center text-[#AAAAAA] text-sm mb-4">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(selectedNews.date)}
                </div>
                
                <h2 className="text-3xl font-bold text-[#0E3F2B] mb-6">
                  {selectedNews.title}
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#333333] leading-relaxed text-lg whitespace-pre-line">
                    {selectedNews.content}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-[#EDE6D6]">
                  <button
                    onClick={closeNewsModal}
                    className="bg-[#0E3F2B] text-white px-6 py-3 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleNews.map((article, index) => (
            <div key={article.id} 
                 className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up animation-delay-${(index + 1) * 100}`}>
              <div className="h-48 bg-[#EDE6D6] flex items-center justify-center">
                <Eye className="text-[#7DB68C]" size={48} />
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-[#AAAAAA] text-sm mb-3">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(article.date)}
                </div>
                
                <h3 className="text-xl font-bold text-[#0E3F2B] mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-[#333333] mb-4 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                
                <button 
                  onClick={() => openNewsModal(article)}
                  className="text-[#7DB68C] hover:text-[#0E3F2B] font-semibold transition-colors duration-200"
                >
                  Читать далее →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMoreNews && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllNews(!showAllNews)}
              className="bg-[#0E3F2B] text-white px-8 py-4 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              {showAllNews ? `Показать меньше` : `Показать все новости (${news.length})`}
            </button>
          </div>
        )}

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#AAAAAA] text-lg">
              Пока нет новостей. Добавьте первую новость!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;