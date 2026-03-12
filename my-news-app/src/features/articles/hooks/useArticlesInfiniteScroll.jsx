// src/features/articles/hooks/useArticlesInfiniteScroll.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

export const useArticlesInfiniteScroll = (
  // baseEndpoint = 'http://goldenages.online/api/scrape/history/paginated'
  baseEndpoint = 'http://localhost:8383/api/scrape/history/paginated'
) => {
  const [allArticles, setAllArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const articlesPerPage = 20;
  const isFetchingRef = useRef(false);

  // Format article (giống logic cũ)
  const formatArticle = useCallback((item, index) => {
    const content = item.content || item.description || "";
    const title = item.title || "Không có tiêu đề";
    const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} phút đọc`;

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

    let thumbnailUrl = null;
    if (mediaType === 'video') {
      thumbnailUrl = item.thumbnail || item.thumbnailUrl || item.image || null;
    }

    // Extract category
    let category = "Tin tức";
    const categoryMap = {
      'giadinh': 'Gia đình',
      'giaitri': 'Giải trí',
      'kinhdoanh': 'Kinh doanh',
      'suckhoe': 'Sức khỏe',
      'thethao': 'Thể thao',
      'vnexpress': 'Tin tức'
    };

    if (mediaUrl && typeof mediaUrl === 'string') {
      for (const [key, value] of Object.entries(categoryMap)) {
        if (mediaUrl.includes(`i1-${key}`) || mediaUrl.includes(key)) {
          category = value;
          break;
        }
      }
    }

    if (category === "Tin tức") {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes("thể thao") || lowerTitle.includes("bóng đá")) category = "Thể thao";
      else if (lowerTitle.includes("giải trí") || lowerTitle.includes("miss")) category = "Giải trí";
      else if (lowerTitle.includes("công nghệ") || lowerTitle.includes("ai")) category = "Công nghệ";
      else if (lowerTitle.includes("kinh tế") || lowerTitle.includes("bất động sản") || lowerTitle.includes("kinh doanh")) category = "Kinh doanh";
      else if (lowerTitle.includes("sức khỏe") || lowerTitle.includes("y tế")) category = "Sức khỏe";
      else if (lowerTitle.includes("gia đình")) category = "Gia đình";
    }

    const rawDate = item.dateTime || item.publishedAt || item.createdAt || item.updatedAt || item.time || null;
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
      featured: false,
    };
  }, []);

  // Fetch page
  const fetchPage = useCallback(async (pageNum) => {
    if (isFetchingRef.current) {
      console.log('⏳ Already fetching, skipping...');
      return;
    }

    isFetchingRef.current = true;
    const isFirstPage = pageNum === 0;

    try {
      if (isFirstPage) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const url = `${baseEndpoint}?page=${pageNum}&size=${articlesPerPage}`;
      console.log(`📡 Fetching: ${url}`);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('📦 API Response:', data);

      if (!data || !Array.isArray(data.content)) {
        throw new Error('Invalid response structure from API');
      }

      const formattedArticles = data.content.map((item, index) =>
        formatArticle(item, pageNum * articlesPerPage + index)
      );

      // Set first article as featured (page 0 only)
      if (pageNum === 0 && formattedArticles.length > 0) {
        formattedArticles[0].featured = true;
      }

      setAllArticles(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const newArticles = formattedArticles.filter(a => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });

      setDisplayedArticles(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const newArticles = formattedArticles.filter(a => !existingIds.has(a.id));
        return [...prev, ...newArticles];
      });

      setPage(pageNum);
      setHasMore(!data.last);
      setTotalElements(data.totalElements || 0);

      console.log(`✅ Page ${pageNum} loaded: ${formattedArticles.length} articles`);
      console.log(`📊 Total: ${allArticles.length + formattedArticles.length} / ${data.totalElements}`);

    } catch (e) {
      console.error('❌ Failed to fetch:', e);
      setError(e.message || 'Không thể tải bài viết.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [baseEndpoint, articlesPerPage, formatArticle, allArticles.length]);

  // Initial load
  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần

  // Load more
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isFetchingRef.current) {
      console.log('⏸️ Cannot load more:', { hasMore, isLoadingMore });
      return;
    }

    console.log('📜 Loading more... (page', page + 1, ')');
    fetchPage(page + 1);
  }, [hasMore, isLoadingMore, page, fetchPage]);

  // Reset (for search)
  const resetPage = useCallback(() => {
    console.log('🔄 Reset to page 0');
    setAllArticles([]);
    setDisplayedArticles([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    isFetchingRef.current = false;
    fetchPage(0);
  }, [fetchPage]);

  return {
    allArticles,
    displayedArticles,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    resetPage,
    totalElements,
  };
};
