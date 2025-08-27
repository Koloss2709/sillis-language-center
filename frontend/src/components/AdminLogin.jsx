import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/login`, {
        password: password
      });

      if (response.data.success) {
        // Сохраняем токен в localStorage
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_logged_in', 'true');
        
        // Устанавливаем заголовок для всех последующих запросов
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Ошибка входа в систему');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E3F2B] to-[#7DB68C] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-[#0E3F2B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#0E3F2B] mb-2">
            Админ панель
          </h1>
          <p className="text-[#AAAAAA]">
            Центр якутского языка «Силис»
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-[#333333] font-medium mb-2">
              Пароль администратора
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-12 pr-12 border border-[#EDE6D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DB68C] focus:border-transparent transition-all duration-200"
                placeholder="Введите пароль"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA]" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] hover:text-[#0E3F2B] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-[#0E3F2B] text-white py-3 px-6 rounded-lg hover:bg-[#7DB68C] transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Вход...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Войти в систему</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-[#EDE6D6] rounded-lg">
          <p className="text-[#333333] text-sm text-center">
            <strong>Для тестирования:</strong><br />
            Пароль: <code className="bg-white px-2 py-1 rounded font-mono">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;