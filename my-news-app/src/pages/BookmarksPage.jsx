// src/pages/BookmarksPage.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useBookmarks } from '../features/articles/hooks/useBookmarks.jsx';
import ArticleCard from '../features/articles/components/ArticleCard.jsx';

const BookmarksPage = () => {
  const { bookmarks, isLoading, error } = useBookmarks();

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="400px">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={6}>
        Bài viết đã lưu ({bookmarks.length})
      </Heading>
      {bookmarks.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {bookmarks.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </SimpleGrid>
      ) : (
        <Text fontSize="lg" color="gray.500" textAlign="center" mt={10}>
          Bạn chưa lưu bài viết nào.
        </Text>
      )}
    </Box>
  );
};

export default BookmarksPage;
