// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Tạo Context
export const AuthContext = createContext(null);

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra token trong localStorage khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Sửa: Lấy id từ payload với khóa "userId"
        setUser({
          id: payload.userId, // Thay payload.id bằng payload.userId
          email: payload.sub,
          role: payload.role,
          token: token,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);
  // Hàm để đăng nhập
  const login = (userData, token) => {
    const finalToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    localStorage.setItem('token', finalToken);

    setUser({ ...userData, token: finalToken });
    navigate('/');
    window.location.reload();
  };

  // Hàm để đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook để dễ dàng sử dụng Context
export const useAuth = () => {
  return useContext(AuthContext);
};
