import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    const adminToken = localStorage.getItem('admin_token');
    
    if (adminLoggedIn === 'true' && adminToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default AdminPage;