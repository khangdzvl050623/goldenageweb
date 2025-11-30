// src/features/financial/hooks/useExchangeRateData.jsx
import { useState, useEffect } from 'react';

// const EXCHANGE_RATE_API_ENDPOINT = 'https://goldenages.online/api/exchange-rate/current-exchange-rate';
const EXCHANGE_RATE_API_ENDPOINT = 'http://localhost:8383/api/exchange-rate/current-exchange-rate';
export const useExchangeRateData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(EXCHANGE_RATE_API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Logic này đã có thể xử lý mảng trực tiếp
        if (Array.isArray(result)) { // <-- Dòng này sẽ bắt được cấu trúc JSON bạn vừa cung cấp
          setData(result);
        } else if (result && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error("Invalid data structure for exchange rates.");
        }
      } catch (e) {
        console.error("Failed to fetch exchange rate data:", e);
        setError("Failed to load exchange rate data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
