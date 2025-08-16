import React from 'react';
import ReactDOM from 'react-dom/client';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Thêm .jsx
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

// Tùy chọn: Mở rộng theme mặc định của Chakra để phù hợp với màu sắc/font của dev.to
const theme = extendTheme({
  colors: {
    // Ví dụ: Định nghĩa màu sắc dựa trên bảng màu của dev.to
    devto: {
      '50': '#f8f8f8', // Nền sáng
      '100': '#efefef',
      '200': '#e0e0e0',
      '300': '#d1d1d1',
      '400': '#c2c2c2',
      '500': '#b3b3b3', // Văn bản mặc định
      '600': '#a4a4a4',
      '700': '#959595',
      '800': '#868686',
      '900': '#777777',
      // Thêm màu chính, phụ, nhấn
      primary: '#3b49df', // Màu xanh dev.to
      secondary: '#000000', // Màu đen dev.to
      accent: '#f7df1e', // Màu vàng dev.to
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`, // Ví dụ font, dev.to sử dụng Inter
    body: `'Inter', sans-serif`,
  },
  // Thêm breakpoints, shadows, v.v.
  breakpoints: {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter> {/* Bọc AuthProvider và App bên trong BrowserRouter */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
