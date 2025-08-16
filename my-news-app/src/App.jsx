// src/App.jsx
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 👈 BƯỚC 1: XÓA BrowserRouter khỏi đây
import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import FinancialInfoPage from './pages/FinancialInfoPage';
import HomePage from './pages/HomePage.jsx';
import { SearchProvider } from './contexts/SearchContext.jsx';

function App() {
  return (

    <SearchProvider>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/financial" element={<FinancialInfoPage />} />
        <Route path="articles/:id" element={<ArticleDetailPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

    </Routes>
    </SearchProvider>

  );
}

export default App;
