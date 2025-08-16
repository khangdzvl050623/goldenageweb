// src/features/financial/hooks/useGoldData.jsx
import { useState, useEffect } from 'react';

// Endpoint cho giá vàng
const GOLD_API_ENDPOINT = 'https://goldenages.online/api/gold-prices/current-gold-prices';

export const useGoldData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(GOLD_API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Logic kiểm tra cấu trúc dữ liệu linh hoạt hơn
        if (Array.isArray(result)) { // Nếu API trả về trực tiếp một mảng
          setData(result);
        } else if (result && Array.isArray(result.data)) { // Nếu API trả về { data: [...] }
          setData(result.data);
        } else {
          // Nếu cấu trúc không khớp với cả hai dạng trên, báo lỗi
          throw new Error("Invalid data structure for gold prices.");
        }
      } catch (e) {
        console.error("Failed to fetch gold data:", e);
        setError("Failed to load gold data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // [] để chỉ gọi một lần khi component được mount

  return { data, isLoading, error };
};
