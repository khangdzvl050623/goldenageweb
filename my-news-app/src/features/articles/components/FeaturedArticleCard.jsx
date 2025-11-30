// src/features/articles/components/FeaturedArticleCard.jsx
import { Box, Heading, Text, Image, Flex, Badge, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import ArticleBookmarkButton from './ArticleBookmarkButton';

export const FeaturedArticleCard = ({ article }) => {
  const [mediaError, setMediaError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFallbackUrl = () => {
    const title = article.title || 'Bài viết';
    const encoded = encodeURIComponent(title.slice(0, 40));
    return `https://placehold.co/1200x600/E2E8F0/A0AEC0?text=${encoded}&font=roboto`;
  };

  const mediaUrlValue = article.mediaUrl || '';
  const mediaTypeValue = (article.mediaType || '').toLowerCase();
  const isVideoType = mediaTypeValue === 'video';
  const isGif = mediaUrlValue.toLowerCase().includes('.gif') &&
    !mediaUrlValue.toLowerCase().includes('video');
  const shouldUseVideoTag = isVideoType && !isGif && !mediaError && mediaUrlValue;
  const posterUrl = article.thumbnailUrl || getFallbackUrl();

  return (
    <Box
      as={RouterLink}
      to={`/articles/${article.id}`}
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.3s"
      display="block"
      textDecoration="none"
      position="relative"
      maxW="full"
    >
      {/* IMAGE/VIDEO - GIẢM CHIỀU CAO */}
      <Box position="relative" h={{ base: '200px', md: '280px' }} overflow="hidden">
        {shouldUseVideoTag ? (
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src={mediaUrlValue}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            onError={() => setMediaError(true)}
            onLoadedData={(e) => {
              e.target.play().catch((err) => {
                console.warn('Video autoplay failed:', err);
              });
            }}
          />
        ) : (
          <Image
            src={imageError ? getFallbackUrl() : (mediaUrlValue || getFallbackUrl())}
            alt={article.title}
            objectFit="cover"
            w="full"
            h="full"
            transition="transform 0.5s"
            _groupHover={{ transform: 'scale(1.05)' }}
            fallbackSrc={getFallbackUrl()}
            onError={(e) => {
              setImageError(true);
              e.target.src = getFallbackUrl();
            }}
            loading="eager"
          />
        )}

        {/* Gradient overlay - NHẸ HƠN */}
        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-t, blackAlpha.600, transparent 50%)"
        />

        {/* Category Badge - NHỎ GỌN HƠN */}
        <Badge
          position="absolute"
          top="4"
          left="4"
          colorScheme={
            article.category === 'Thể thao' ? 'green' :
              article.category === 'Giải trí' ? 'pink' :
                article.category === 'Kinh doanh' ? 'blue' :
                  article.category === 'Sức khỏe' ? 'red' :
                    article.category === 'Gia đình' ? 'purple' :
                      article.category === 'Công nghệ' ? 'cyan' : 'orange'
          }
          fontWeight="semibold"
          fontSize="xs"
          px="2.5"
          py="1"
          borderRadius="md"
          textTransform="uppercase"
        >
          {article.category}
        </Badge>

        {/* Video indicator */}
        {shouldUseVideoTag && (
          <Badge
            position="absolute"
            bottom="4"
            left="4"
            bg="whiteAlpha.900"
            color="gray.800"
            fontSize="xs"
            px="2.5"
            py="1"
            borderRadius="md"
            fontWeight="semibold"
          >
            ▶ Video
          </Badge>
        )}

        {/* Bookmark Button - NHỎ HƠN */}
        <ArticleBookmarkButton
          article={article}
          position="absolute"
          top="4"
          right="4"
          bg="whiteAlpha.300"
          backdropFilter="blur(8px)"
          p="1.5"
          borderRadius="full"
          _hover={{ bg: 'whiteAlpha.500' }}
        />
      </Box>

      {/* CONTENT - GIẢM PADDING */}
      <Box p={{ base: 5, md: 6 }}>
        {/* Title - GIẢM SIZE */}
        <Heading
          size={{ base: 'md', md: 'lg' }}
          color="gray.800"
          noOfLines={2}
          mb="3"
          lineHeight="shorter"
        >
          {article.title}
        </Heading>

        {/* Meta info - GỌN HƠN */}
        <Flex
          gap="3"
          color="gray.500"
          fontSize="sm"
          mb="3"
          align="center"
        >
          <Flex align="center" gap="1.5">
            <Clock size={14} />
            <Text>{article.readTime}</Text>
          </Flex>
          <Text fontSize="xs">•</Text>
          <Text fontSize="sm">{article.publishedAt}</Text>
        </Flex>

        {/* Read more button - NHỎ HƠN */}
        <Button
          variant="link"
          colorScheme="blue"
          rightIcon={<ArrowRight size={16} />}
          fontWeight="semibold"
          fontSize="sm"
        >
          Đọc thêm
        </Button>
      </Box>
    </Box>
  );
};
