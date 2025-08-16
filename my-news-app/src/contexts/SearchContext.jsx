import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {useArticles} from '../features/articles/hooks/useArticles.jsx';

const SearchContext = createContext();

/**
 * Custom hook to encapsulate all search logic.
 * This hook performs client-side searching on a given list of articles.
 * It also includes debouncing for suggestions to avoid excessive re-renders.
 * @param {Array} initialArticles - The list of articles to search through.
 */
const useSearch = (initialArticles) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  const executeSearch = useCallback((term) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      if (!initialArticles) {
        setSearchResults([]);
        return;
      }

      const filteredResults = initialArticles.filter(article =>
        article.title.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('An error occurred during the search.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [initialArticles]);

  const resetSearchState = useCallback(() => {
    setSearchTerm('');
    setSearchResults(null);
    setSuggestions([]);
    setIsSearching(false);
    setSearchError(null);
  }, []);

  const handleSearchTermChange = useCallback((event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      setIsFetchingSuggestions(true);
      const newSuggestions = initialArticles
        ? initialArticles
          .filter(article => article.title.toLowerCase().includes(term.toLowerCase()))
          .slice(0, 5)
          .map(article => article.title)
        : [];
      setSuggestions(newSuggestions);
      setIsFetchingSuggestions(false);
    } else {
      setSuggestions([]);
    }
  }, [initialArticles]);

  const handleSelectSuggestion = useCallback((sugg) => {
    setSearchTerm(sugg);
    setSuggestions([]);
  }, []);

  useEffect(() => {
    // This effect ensures that when searchTerm is empty, searchResults is also reset.
    if (searchTerm === '') {
      setSearchResults(null);
    }
  }, [searchTerm]);

  return {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    suggestions,
    isFetchingSuggestions,
    handleSearchTermChange,
    executeSearch,
    handleSelectSuggestion,
    resetSearchState,
  };
};

/**
 * Provider component that makes search state and functions available to any child component.
 */
export const SearchProvider = ({children}) => {
  const API_ENDPOINT = 'https://goldenages.online/api/scrape/history';
  const {articles: initialArticles, isLoading, error} = useArticles(API_ENDPOINT);

  const searchHook = useSearch(initialArticles);

  const value = {
    ...searchHook,
    initialArticles,
    isLoading,
    error,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
