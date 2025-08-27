import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  FileText, 
  Users, 
  Settings, 
  Package, 
  Phone,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Set up axios with auth token
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_logged_in');
    delete axios.defaults.headers.common['Authorization'];
    onLogout();
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: BarChart3 },
    { id: 'news', label: 'Новости', icon: FileText },
    { id: 'submissions', label: 'Заявки', icon: Users },
    { id: 'packages', label: 'Пакеты услуг', icon: Package },
    { id: 'contacts', label: 'Контакты', icon: Phone },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_c8706acf-6165-4cd7-8d7f-004f27bb046b/artifacts/nayanc7r_%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20WhatsApp%202025-08-25%20%D0%B2%2008.48.36_4f8baf5a-Photoroom.png"
                alt="Силис" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-[#0E3F2B]">Админ панель</h1>
                <p className="text-sm text-gray-500">Центр якутского языка «Силис»</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#0E3F2B] transition-colors"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm mr-8">
            <nav className="p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#0E3F2B] text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#0E3F2B]'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <DashboardTab stats={stats} loading={loading} />
            )}
            {activeTab === 'news' && (
              <NewsTab />
            )}
            {activeTab === 'submissions' && (
              <SubmissionsTab />
            )}
            {activeTab === 'packages' && (
              <PackagesTab />
            )}
            {activeTab === 'contacts' && (
              <ContactsTab />
            )}
            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Всего новостей',
      value: stats.total_news || 0,
      color: 'bg-blue-500',
      icon: FileText
    },
    {
      title: 'Опубликованные новости',
      value: stats.published_news || 0,
      color: 'bg-green-500',
      icon: FileText
    },
    {
      title: 'Всего заявок',
      value: stats.total_contact_submissions || 0,
      color: 'bg-purple-500',
      icon: Users
    },
    {
      title: 'Заявки за неделю',
      value: stats.recent_submissions || 0,
      color: 'bg-orange-500',
      icon: Users
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#0E3F2B] mb-6">Обзор системы</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <IconComponent className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Plus className="text-[#0E3F2B] mb-2" size={20} />
            <p className="font-medium text-gray-900">Добавить новость</p>
            <p className="text-sm text-gray-600">Создать новую публикацию</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="text-[#0E3F2B] mb-2" size={20} />
            <p className="font-medium text-gray-900">Просмотреть заявки</p>
            <p className="text-sm text-gray-600">Обработать новые заявки</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Settings className="text-[#0E3F2B] mb-2" size={20} />
            <p className="font-medium text-gray-900">Настройки сайта</p>
            <p className="text-sm text-gray-600">Изменить контакты и пакеты</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// News Tab Component
const NewsTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/news`);
      setNews(response.data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (newsId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await axios.delete(`${API}/news/${newsId}`);
        fetchNews(); // Refresh list
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Ошибка удаления новости');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0E3F2B]">Управление новостями</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingNews(null);
          }}
          className="bg-[#0E3F2B] text-white px-4 py-2 rounded-lg hover:bg-[#7DB68C] transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Добавить новость</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Дата: {new Date(item.date).toLocaleDateString('ru-RU')}</span>
                    <span className={`px-2 py-1 rounded ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.published ? 'Опубликована' : 'Черновик'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-600 hover:text-[#0E3F2B] transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {news.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Новостей пока нет</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <NewsFormModal
          news={editingNews}
          onClose={() => {
            setShowForm(false);
            setEditingNews(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingNews(null);
            fetchNews();
          }}
        />
      )}
    </div>
  );
};

// News Form Modal Component
const NewsFormModal = ({ news, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    excerpt: news?.excerpt || '',
    content: news?.content || '',
    date: news?.date ? new Date(news.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    published: news?.published !== false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (news) {
        // Update existing news
        await axios.put(`${API}/news/${news.id}`, formData);
      } else {
        // Create new news
        await axios.post(`${API}/news`, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Ошибка сохранения новости');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0E3F2B]">
              {news ? 'Редактировать новость' : 'Добавить новость'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Заголовок</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C]"
              placeholder="Введите заголовок новости"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Краткое описание</label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C]"
              placeholder="Краткое описание для карточки"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Полный текст</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] resize-none"
              placeholder="Полный текст новости"
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Дата публикации</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C]"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="w-4 h-4 text-[#7DB68C] border-gray-300 rounded focus:ring-[#7DB68C]"
                />
                <span className="text-gray-700">Опубликовать</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0E3F2B] text-white py-3 px-6 rounded-lg hover:bg-[#7DB68C] transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{news ? 'Обновить' : 'Создать'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Submissions Tab Component  
const SubmissionsTab = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/submissions`);
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (submissionId, newStatus) => {
    try {
      await axios.put(`${API}/admin/submissions/${submissionId}/status`, null, {
        params: { new_status: newStatus }
      });
      fetchSubmissions(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'processed': return 'В работе';
      case 'replied': return 'Отвечено';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#0E3F2B] mb-6">Заявки на КП</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {getStatusText(submission.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Телефон:</strong> {submission.phone}
                    </div>
                    <div>
                      <strong>Email:</strong> {submission.email}
                    </div>
                    {submission.organization && (
                      <div>
                        <strong>Организация:</strong> {submission.organization}
                      </div>
                    )}
                    <div>
                      <strong>Дата:</strong> {new Date(submission.created_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                  {submission.comment && (
                    <div className="mt-3">
                      <strong className="text-sm text-gray-700">Комментарий:</strong>
                      <p className="text-sm text-gray-600 mt-1">{submission.comment}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Изменить статус:</span>
                {['new', 'processed', 'replied'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(submission.id, status)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      submission.status === status
                        ? getStatusColor(status)
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {submissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Заявок пока нет</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Packages Tab Component
const PackagesTab = () => {
  const [packages, setPackages] = useState({ b2c: [], b2b: [] });
  const [loading, setLoading] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'b2c' or 'b2b'

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/content`);
      setPackages(response.data.packages || { b2c: [], b2b: [] });
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const updatePackages = async (newPackages) => {
    try {
      setLoading(true);
      await axios.put(`${API}/admin/packages`, newPackages);
      setPackages(newPackages);
      setEditingType(null);
    } catch (error) {
      console.error('Error updating packages:', error);
      alert('Ошибка сохранения пакетов');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#0E3F2B] mb-6">Управление пакетами услуг</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* B2C Packages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">B2C - Для семей и детей</h3>
            <button
              onClick={() => setEditingType('b2c')}
              className="bg-[#0E3F2B] text-white px-4 py-2 rounded-lg hover:bg-[#7DB68C] transition-colors flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Редактировать</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {packages.b2c.map((pkg, index) => (
              <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                  {pkg.popular && (
                    <span className="bg-[#7DB68C] text-white text-xs px-2 py-1 rounded">Популярный</span>
                  )}
                  {pkg.freeLesson && (
                    <span className="bg-[#0E3F2B] text-white text-xs px-2 py-1 rounded ml-2">1 урок FREE</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{pkg.description}</p>
                <ul className="text-sm text-gray-600">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#7DB68C] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* B2B Packages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">B2B - Для компаний и органов власти</h3>
            <button
              onClick={() => setEditingType('b2b')}
              className="bg-[#0E3F2B] text-white px-4 py-2 rounded-lg hover:bg-[#7DB68C] transition-colors flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Редактировать</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {packages.b2b.map((pkg, index) => (
              <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                  {pkg.popular && (
                    <span className="bg-[#7DB68C] text-white text-xs px-2 py-1 rounded">Популярный</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{pkg.description}</p>
                <ul className="text-sm text-gray-600">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-[#7DB68C] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingType && (
        <PackageEditModal
          packages={packages}
          editingType={editingType}
          onClose={() => setEditingType(null)}
          onSave={updatePackages}
        />
      )}
    </div>
  );
};

// Contacts Tab Component
const ContactsTab = () => {
  const [contacts, setContacts] = useState({
    email: '',
    phones: [],
    address: '',
    social: {}
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/content`);
      setContacts(response.data.contacts || {});
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const updateContacts = async (newContacts) => {
    try {
      setLoading(true);
      await axios.put(`${API}/admin/contacts`, newContacts);
      setContacts(newContacts);
      setEditing(false);
    } catch (error) {
      console.error('Error updating contacts:', error);
      alert('Ошибка сохранения контактов');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0E3F2B]">Управление контактами</h2>
        <button
          onClick={() => setEditing(true)}
          className="bg-[#0E3F2B] text-white px-4 py-2 rounded-lg hover:bg-[#7DB68C] transition-colors flex items-center space-x-2"
        >
          <Edit size={20} />
          <span>Редактировать</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{contacts.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефоны</label>
                {contacts.phones?.map((phone, index) => (
                  <p key={index} className="text-gray-900">{phone}</p>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <p className="text-gray-900">{contacts.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Социальные сети</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <p className="text-gray-900">@{contacts.social?.instagram}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
              <p className="text-gray-900">{contacts.social?.telegram}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VKontakte</label>
              <p className="text-gray-900">{contacts.social?.vk}</p>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <ContactEditModal
          contacts={contacts}
          onClose={() => setEditing(false)}
          onSave={updateContacts}
        />
      )}
    </div>
  );
};

const SettingsTab = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-2xl font-bold text-[#0E3F2B] mb-6">Настройки сайта</h2>
    <p className="text-gray-600">Общие настройки сайта будут реализованы следующими...</p>
  </div>
);

export default AdminPanel;