// src/features/articles/hooks/useArticles.jsx
import { useState, useEffect } from 'react';

export const useArticles = (endpoint = 'http://localhost:8383/api/scrape/history') => {
  const [allArticles, setAllArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      if (!endpoint) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        let rawArticles = [];
        if (Array.isArray(data)) rawArticles = data;
        else if (data?.data) rawArticles = data.data;
        else if (data?.articles) rawArticles = data.articles;
        else throw new Error("Invalid data structure from API.");

        console.log('Raw API data:', rawArticles); // DEBUG: XEM CẤU TRÚC

        const formattedArticles = rawArticles.map((item, index) => {
          const content = item.content || item.description || "";
          const title = item.title || "Không có tiêu đề";
          const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} phút đọc`;

          // THÊM DEBUG CHO ẢNH
          console.log(`Article ${index}:`, {
            image: item.image,
            mediaUrl: item.mediaUrl,
            thumbnail: item.thumbnail,
            title,
          });

          const detectMediaType = (url, fallbackType = 'image') => {
            if (!url || typeof url !== 'string') return fallbackType;
            if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return 'video';
            return fallbackType;
          };

          let mediaTypeRaw = item.mediaType || 'image';
          let mediaType = typeof mediaTypeRaw === 'string' ? mediaTypeRaw.toLowerCase() : 'image';
          let mediaUrlCandidate = item.mediaUrl || item.image || item.thumbnail;

          if (mediaType === 'video') {
            mediaUrlCandidate = item.mediaUrl || item.videoUrl || item.image || item.thumbnail;
          } else if (mediaType === 'image') {
            mediaUrlCandidate = item.image || item.mediaUrl || item.thumbnail;
          } else {
            mediaType = detectMediaType(mediaUrlCandidate);
          }

          if (!mediaUrlCandidate) {
            mediaUrlCandidate = `https://placehold.co/1200x600/E2E8F0/A0AEC0?text=${encodeURIComponent(title.slice(0, 30))}&font=roboto`;
            mediaType = 'image';
          }

          const mediaUrl = mediaUrlCandidate;

          // Lấy thumbnailUrl cho video (chỉ lấy nếu có thumbnail/image thực sự)
          let thumbnailUrl = null;
          if (mediaType === 'video') {
            // Ưu tiên: thumbnail -> thumbnailUrl -> image (không dùng mediaUrl vì đó là video URL)
            thumbnailUrl = item.thumbnail || item.thumbnailUrl || item.image || null;
          }

          // Extract category từ URL (i1-giadinh, i1-giaitri, etc.)
          let category = "Tin tức";
          const categoryMap = {
            'giadinh': 'Gia đình',
            'giaitri': 'Giải trí',
            'kinhdoanh': 'Kinh doanh',
            'suckhoe': 'Sức khỏe',
            'thethao': 'Thể thao',
            'vnexpress': 'Tin tức'
          };

          // Kiểm tra trong mediaUrl
          if (mediaUrl && typeof mediaUrl === 'string') {
            for (const [key, value] of Object.entries(categoryMap)) {
              if (mediaUrl.includes(`i1-${key}`) || mediaUrl.includes(key)) {
                category = value;
                break;
              }
            }
          }

          // Fallback: kiểm tra trong title nếu không tìm thấy trong URL
          if (category === "Tin tức") {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes("thể thao") || lowerTitle.includes("bóng đá")) category = "Thể thao";
            else if (lowerTitle.includes("giải trí") || lowerTitle.includes("miss")) category = "Giải trí";
            else if (lowerTitle.includes("công nghệ") || lowerTitle.includes("ai")) category = "Công nghệ";
            else if (lowerTitle.includes("kinh tế") || lowerTitle.includes("bất động sản") || lowerTitle.includes("kinh doanh")) category = "Kinh doanh";
            else if (lowerTitle.includes("sức khỏe") || lowerTitle.includes("y tế")) category = "Sức khỏe";
            else if (lowerTitle.includes("gia đình")) category = "Gia đình";
          }

          const rawDate =
            item.dateTime ||
            item.publishedAt ||
            item.createdAt ||
            item.updatedAt ||
            item.time ||
            null;

          const dateObj = rawDate ? new Date(rawDate) : null;
          const hasValidDate = dateObj && !isNaN(dateObj);
          const publishedAtLabel = hasValidDate
            ? dateObj.toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short'
            })
            : `${index + 1} giờ trước`;

          return {
            id: item.id || `article-${index}-${Date.now()}`,
            title,
            content,
            mediaUrl,
            mediaType,
            thumbnailUrl,
            category,
            readTime,
            publishedAt: publishedAtLabel,
            dateTime: hasValidDate ? dateObj.toISOString() : null,
            featured: index === 0,
          };
        });

        setAllArticles(formattedArticles);
        setDisplayedArticles(formattedArticles.slice(0, articlesPerPage));
        setPage(1);
      } catch (e) {
        console.error("Failed to fetch articles:", e);
        setError(e.message || "Không thể tải bài viết.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [endpoint]);

  const loadMore = () => {
    console.log('loadMore ĐƯỢC GỌI');
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const end = nextPage * articlesPerPage;
    const newArticles = allArticles.slice(0, end);

    setPage(nextPage);
    setDisplayedArticles(newArticles);

    setTimeout(() => {
      setIsLoadingMore(false);
      console.log('TẢI XONG!');
    }, 300);
  };

  const resetPage = () => {
    setPage(1);
    setDisplayedArticles(allArticles.slice(0, articlesPerPage));
  };

  const hasMore = page * articlesPerPage < allArticles.length;

  return {
    allArticles,
    displayedArticles,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    resetPage,
  };
};
