// src/contexts/SearchContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useArticlesInfiniteScroll } from '../features/articles/hooks/useArticlesInfiniteScroll';

const SearchContext = createContext();

// Hook xử lý search (giữ nguyên)
const useSearch = (initialArticles) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = useCallback((term) => {
    const trimmed = term.trim();
    if (!trimmed || !initialArticles) {
      setActiveSearchTerm('');
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const filtered = initialArticles.filter(article =>
        article.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        (article.content && article.content.toLowerCase().includes(trimmed.toLowerCase()))
      );
      setActiveSearchTerm(trimmed);
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
    }
  }, [initialArticles]);

  const handleSearchTermChange = useCallback((e) => {
    const term = e.target.value;
    setSearchTerm(term);
  }, []);

  useEffect(() => {
    if (searchTerm === '' && activeSearchTerm !== '') {
      setActiveSearchTerm('');
      setSearchResults([]);
    }
  }, [searchTerm, activeSearchTerm]);

  const resetSearchState = useCallback(() => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setSearchResults([]);
  }, []);

  return {
    searchTerm,
    activeSearchTerm,
    searchResults,
    isSearching,
    handleSearchTermChange,
    executeSearch,
    resetSearchState,
  };
};

// Provider — UPDATED để dùng hook mới
export const SearchProvider = ({ children }) => {
  //  THAY ĐỔI: Dùng useArticlesInfiniteScroll thay vì useArticles
  const {
    allArticles,
    displayedArticles,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    resetPage: resetPageFromHook,
    totalElements,
  } = useArticlesInfiniteScroll();

  const resetPageRef = useRef(resetPageFromHook);
  useEffect(() => {
    resetPageRef.current = resetPageFromHook;
  }, [resetPageFromHook]);

  const searchHook = useSearch(allArticles);

  useEffect(() => {
    if (searchHook.searchTerm === '') {
      resetPageRef.current?.();
    }
  }, [searchHook.searchTerm]);

  return (
    <SearchContext.Provider value={{
      ...searchHook,
      displayedArticles,
      isLoading,
      isLoadingMore,
      allArticles,
      error,
      loadMore,
      hasMore,
      totalElements, // THÊM totalElements để ArticleFeed có thể dùng
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearchContext must be used within SearchProvider');
  return context;
};
