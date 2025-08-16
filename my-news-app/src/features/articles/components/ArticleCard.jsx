// src/features/articles/components/ArticleCard.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ArticleBookmarkButton from './ArticleBookmarkButton.jsx';

/**
 * A component to display an article card with view and bookmark options.
 * The entire card serves as a navigation link, except for the bookmark button.
 * @param {{id: string, title: string, content: string, mediaUrl: string}} article - Article data.
 */
const ArticleCard = ({ article }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      _hover={{ boxShadow: "lg", transform: "translateY(-2px)", transition: "all 0.2s" }}
      height="100%"
      display="flex"
      flexDirection="column"
      position="relative"
      textDecoration="none"
      cursor="pointer"
      // Lần này chúng ta không dùng onClick trên Box nữa
      // thay vào đó, chúng ta sẽ để RouterLink bao bọc toàn bộ nội dung
    >
      <RouterLink to={`/articles/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box>
          {/* Bookmark button with high z-index and click stop propagation */}
          <Flex
            position="absolute"
            top={4}
            right={4}
            zIndex={100}
          >
            <ArticleBookmarkButton article={article} />
          </Flex>

          {article.mediaUrl && (
            <Box
              position="relative"
              width="100%"
              maxH="180px"
              borderRadius="lg"
              overflow="hidden"
              mb={2}
            >
              <Image
                src={article.mediaUrl}
                alt={article.title}
                objectFit="cover"
                width="100%"
                height="100%"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=No+Image';
                }}
              />
            </Box>
          )}

          <VStack align="start" spacing={3} flex="1">
            <Heading as="h3" size="md" color="gray.800" noOfLines={3}>
              {article.title}
            </Heading>
            <Text mt={2} color="gray.600" noOfLines={4}>
              {article.content}
            </Text>
          </VStack>

          <Flex justify="space-between" align="center" mt={4} width="full">
            {article.readTime && <Text fontSize="xs" color="gray.500">{article.readTime} read</Text>}
          </Flex>
        </Box>
      </RouterLink>
    </Box>
  );
};

export default ArticleCard;
