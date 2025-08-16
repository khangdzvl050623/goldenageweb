import React, {createContext, useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';

// 1. Tạo Context
export const AuthContext = createContext(null);

// 2. Tạo Provider Component
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null); // Lưu thông tin user (email, role, name...)
  const [loading, setLoading] = useState(true); // Trạng thái loading ban đầu
  const navigate = useNavigate();

  // Kiểm tra token trong localStorage khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Giải mã token để lấy thông tin người dùng (payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({email: payload.sub, role: payload.role, name: payload.name}); // Giả sử payload có sub (email), role và name
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token'); // Xóa token cũ nếu không hợp lệ
      }
    }
    setLoading(false); // Đã kiểm tra xong token ban đầu
  }, []);

  // Hàm để đăng nhập
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData); // Set user info after login
    navigate('/'); // Chuyển hướng về trang chủ
  };

  // Hàm để đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
  };

  // Nếu đang loading (đang kiểm tra token), có thể hiển thị spinner hoặc null
  if (loading) {
    return <div>Loading authentication...</div>; // Hoặc một spinner/placeholder
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook để dễ dàng sử dụng Context
export const useAuth = () => {
  return useContext(AuthContext);
};
