import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Container,
} from '@chakra-ui/react';
import { TrendingUp, ChevronDown } from 'lucide-react';

import { useSearchContext } from '../../../contexts/SearchContext';
import { FeaturedArticleCard } from './FeaturedArticleCard';
import ArticleCard from './ArticleCard';
import { FeaturedSkeleton, ArticleCardSkeleton } from './ArticleSkeleton';

const ArticleFeed = () => {
  const {
    displayedArticles = [],
    searchResults = [],
    isLoading,
    isLoadingMore,
    allArticles = [],
    error,
    loadMore,
    hasMore,
    isSearching,
    searchTerm = '',
    activeSearchTerm = '',
  } = useSearchContext();

  const isSearchingMode = typeof activeSearchTerm === 'string' && activeSearchTerm.trim() !== '';
  const dataToShow = isSearchingMode
    ? (Array.isArray(searchResults) ? searchResults : [])
    : (Array.isArray(displayedArticles) ? displayedArticles : []);

  // ================== LOADING STATE ==================
  if (isLoading && dataToShow.length === 0) {
    return (
      <VStack spacing="10" align="stretch">
        <Box maxW="full" w="full" px={{ base: 2, lg: 0 }}>
          <FeaturedSkeleton />
        </Box>
        <VStack spacing="5" align="stretch" maxW="3xl" mx="auto">
          {[...Array(4)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
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
          <AlertIcon />
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
    <Container maxW="6xl" px={{ base: 0, md: 4 }} py={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 8, md: 12 }} align="stretch" w="full">
        {/* HEADER */}
        <Box
          textAlign={{ base: 'center', md: 'left' }}
          py={{ base: 2, md: 4 }}
          px={{ base: 4, md: 0 }}
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
            <TrendingUp size={18} />
            <Text>
              {isSearchingMode ? `Tìm kiếm: "${activeSearchTerm}"` : 'Tin tức nổi bật'}
            </Text>
          </Box>
          <Heading
            mt="4"
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            color="gray.800"
            fontWeight="extrabold"
          >
            {isSearchingMode
              ? `Tìm thấy ${searchResults.length} bài viết`
              : 'Bài viết mới nhất'}
          </Heading>
        </Box>

        {/* Featured */}
        {featured && (
          <Box px={{ base: 4, md: 0 }}>
            <FeaturedArticleCard article={featured} />
          </Box>
        )}

        {/* Danh sách */}
        <Box px={{ base: 4, md: 0 }}>
          <VStack spacing={{ base: 4, md: 5 }} align="stretch" w="full">
            {others.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </VStack>
        </Box>

        {/* ĐANG TÌM KIẾM */}
        {isSearching && (
          <Box textAlign="center" py="4">
            <Spinner size="md" color="blue.500" />
            <Text mt="2" fontSize="sm" color="gray.600">Đang tìm kiếm...</Text>
          </Box>
        )}

        {/* NÚT XEM THÊM — STYLE SOFT OUTLINE WITH PULSE */}
        {!isSearchingMode && hasMore && (
          <Box textAlign="center" py="6">
            <Box
              position="relative"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                '@keyframes pulse-ring': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 0.4,
                  },
                  '100%': {
                    transform: 'scale(1.2)',
                    opacity: 0,
                  },
                },
              }}
            >
              {/* Pulse Effect */}
              <Box
                position="absolute"
                width="100%"
                height="100%"
                borderRadius="full"
                border="2px solid"
                borderColor="gray.400"
                animation="pulse-ring 1.5s ease-out infinite"
                pointerEvents="none"
              />

              {/* Button */}
              <Button
                position="relative"
                onClick={loadMore}
                isLoading={isLoadingMore}
                loadingText="Đang tải..."
                variant="outline"
                size="lg"
                px="8"
                py="6"
                h="auto"
                borderRadius="full"
                borderWidth="2px"
                borderColor="gray.300"
                color="gray.700"
                bg="white"
                fontWeight="semibold"
                leftIcon={<ChevronDown size={20} color="#6B7280" />}
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.400',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                transition="all 0.2s"
              >
                Xem thêm ({allArticles.length - displayedArticles.length} bài còn lại)
              </Button>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ArticleFeed;
