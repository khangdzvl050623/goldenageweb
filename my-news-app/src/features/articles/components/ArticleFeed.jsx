import {useEffect, useRef} from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Container,
} from '@chakra-ui/react';
import {TrendingUp} from 'lucide-react';

import {useSearchContext} from '../../../contexts/SearchContext';
import {FeaturedArticleCard} from './FeaturedArticleCard';
import ArticleCard from './ArticleCard';
import {FeaturedSkeleton, ArticleCardSkeleton} from './ArticleSkeleton';

const ArticleFeed = () => {
  const {
    displayedArticles = [],
    searchResults = [],
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    isSearching,
    activeSearchTerm = '',
    totalElements = 0,
  } = useSearchContext();

  const isSearchingMode = typeof activeSearchTerm === 'string' && activeSearchTerm.trim() !== '';
  const dataToShow = isSearchingMode
    ? (Array.isArray(searchResults) ? searchResults : [])
    : (Array.isArray(displayedArticles) ? displayedArticles : []);

  // ✅ INFINITE SCROLL với Intersection Observer
  const loadMoreTriggerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Chỉ setup observer khi KHÔNG ở chế độ search
    if (isSearchingMode || !hasMore) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const options = {
      root: null, // viewport
      rootMargin: '400px', // Load khi còn cách 400px từ bottom
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;

      // Khi trigger element hiển thị trên màn hình
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        console.log('🔄 Scroll trigger reached, loading more...');
        loadMore();
      }
    }, options);

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore, isSearchingMode]);

  // ================== LOADING STATE ==================
  if (isLoading && dataToShow.length === 0) {
    return (
      <VStack spacing="10" align="stretch">
        <Box maxW="full" w="full" px={{base: 2, lg: 0}}>
          <FeaturedSkeleton/>
        </Box>
        <VStack spacing="5" align="stretch" maxW="3xl" mx="auto">
          {[...Array(4)].map((_, i) => (
            <ArticleCardSkeleton key={i}/>
          ))}
        </VStack>
      </VStack>
    );
  }

  // ================== ERROR STATE ==================
  if (error) {
    return (
      <Box textAlign="center" py="20">
        <Alert status="error" borderRadius="md">
          <AlertIcon/>
          <Text>{error}</Text>
        </Alert>
      </Box>
    );
  }

  // ================== EMPTY STATE ==================
  if (dataToShow.length === 0) {
    return (
      <Box textAlign="center" py="20">
        <Text color="gray.500" fontSize="lg">
          {isSearchingMode
            ? `Không tìm thấy bài viết nào cho "${activeSearchTerm}"`
            : 'Không có bài viết nào.'}
        </Text>
      </Box>
    );
  }

  const featured = dataToShow.find((a) => a.featured);
  const others = dataToShow.filter((a) => !a.featured);

  return (
    <Container maxW="6xl" px={{base: 0, md: 4}} py={{base: 4, md: 6}}>
      <VStack spacing={{base: 8, md: 12}} align="stretch" w="full">
        {/* HEADER */}
        <Box
          textAlign={{base: 'center', md: 'left'}}
          py={{base: 2, md: 4}}
          px={{base: 4, md: 0}}
        >
          <Box
            display="inline-flex"
            alignItems="center"
            gap="2"
            bg="blue.50"
            color="blue.700"
            px="4"
            py="2"
            borderRadius="full"
            fontWeight="semibold"
            fontSize="sm"
            boxShadow="sm"
          >
            <TrendingUp size={18}/>
            <Text>
              {isSearchingMode ? `Tìm kiếm: "${activeSearchTerm}"` : 'Tin tức nổi bật'}
            </Text>
          </Box>
          <Heading
            mt="4"
            fontSize={{base: '2xl', md: '3xl', lg: '4xl'}}
            color="gray.800"
            fontWeight="extrabold"
          >
            {isSearchingMode
              ? `Tìm thấy ${searchResults.length} bài viết`
              : 'Bài viết mới nhất'}
          </Heading>

          {/* Progress indicator */}
          {!isSearchingMode && totalElements > 0 && (
            <Text mt="2" color="gray.600" fontSize="sm">
              Đang hiển thị {displayedArticles.length} / {totalElements} bài viết
            </Text>
          )}
        </Box>

        {/* Featured */}
        {featured && (
          <Box px={{base: 4, md: 0}}>
            <FeaturedArticleCard article={featured}/>
          </Box>
        )}

        {/* Danh sách */}
        <Box px={{base: 4, md: 0}}>
          <VStack spacing={{base: 4, md: 5}} align="stretch" w="full">
            {others.map((article) => (
              <ArticleCard key={article.id} article={article}/>
            ))}
          </VStack>
        </Box>

        {/* ĐANG TÌM KIẾM */}
        {isSearching && (
          <Box textAlign="center" py="8">
            <Spinner size="md" color="blue.500"/>
            <Text mt="2" fontSize="sm" color="gray.600">
              Đang tìm kiếm...
            </Text>
          </Box>
        )}

        {/* ✅ LOADING MORE - Hiện khi đang load thêm */}
        {isLoadingMore && (
          <Box textAlign="center" py="8">
            <Spinner
              size="lg"
              color="blue.500"
              thickness="4px"
              speed="0.65s"
            />
            <Text mt="3" fontSize="sm" color="gray.600" fontWeight="medium">
              Đang tải thêm bài viết...
            </Text>
          </Box>
        )}

        {/* ✅ INFINITE SCROLL TRIGGER - Element ẩn để trigger load more */}
        {!isSearchingMode && hasMore && !isLoadingMore && (
          <Box
            ref={loadMoreTriggerRef}
            h="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            opacity="0.6"
          >
            <Text fontSize="sm" color="gray.400">
              Cuộn xuống để tải thêm...
            </Text>
          </Box>
        )}

        {/* ✅ END MESSAGE - Hiện khi đã hết bài viết */}
        {!hasMore && displayedArticles.length > 0 && !isSearchingMode && (
          <Box
            textAlign="center"
            py="12"
            px="4"
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <Box
              display="inline-flex"
              alignItems="center"
              gap="2"
              bg="green.50"
              color="green.700"
              px="6"
              py="3"
              borderRadius="full"
              fontWeight="semibold"
              fontSize="sm"
              boxShadow="sm"
            >
              <Text>✅</Text>
              <Text>
                Đã tải hết {displayedArticles.length} bài viết!
              </Text>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ArticleFeed;
