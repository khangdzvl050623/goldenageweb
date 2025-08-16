import {useState, useEffect} from 'react';

export const useArticles = (endpoint) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        const response = await fetch(endpoint); // Sử dụng endpoint được truyền vào
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setArticles(data);
        } else if (data && Array.isArray(data.data)) {
          setArticles(data.data);
        } else {
          console.error("Unexpected API response structure:", data);
          throw new Error("Invalid data structure from API.");
        }

      } catch (e) {
        console.error("Failed to fetch articles:", e);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [endpoint]);

  return {articles, isLoading, error};
};
