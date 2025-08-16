// src/pages/HomePage.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import ArticleCard from '../features/articles/components/ArticleCard.jsx';
import { useSearchContext } from '../contexts/SearchContext.jsx';

const HomePage = () => {
  const {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    initialArticles,
    isLoading,
    error,
  } = useSearchContext();

  const articlesToShow = searchTerm ? searchResults : initialArticles;

  return (
    <>
      <Heading as="h2" size="lg" mb={4} color="gray.700">
        {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Bài viết mới nhất'}
      </Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <Text>Lỗi khi tải bài viết ban đầu: {error}</Text>
        </Alert>
      )}

      {searchError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <Text>{searchError}</Text>
        </Alert>
      )}

      {isLoading && !initialArticles ? (
        <Center py={10}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : isSearching ? (
        <Center py={10}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {articlesToShow && articlesToShow.length > 0 ? (
            articlesToShow.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <Center py={10}>
              <Text fontSize="lg" color="gray.600">
                {searchTerm !== '' ? `Không tìm thấy bài viết nào cho "${searchTerm}".` : 'Đang tải bài viết ...'}
              </Text>
            </Center>
          )}
        </VStack>
      )}
    </>
  );
};

export default HomePage;
