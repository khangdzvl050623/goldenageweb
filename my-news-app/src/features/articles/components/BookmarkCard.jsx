// src/features/articles/components/BookmarkCard.jsx
import {
  Box,
  Image,
  Badge,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import { Clock, ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import React, { useState } from 'react';

const BookmarkCard = ({ article }) => {
  const {
    id,
    title,
    mediaUrl,
    mediaType,
    thumbnailUrl,
    category,
    readTime,
    publishedAt,
    summary,
  } = article;

  const [mediaError, setMediaError] = useState(false);

  const getFallbackUrl = () => {
    return `https://placehold.co/480x320/E2E8F0/A0AEC0?text=${encodeURIComponent(
      title?.slice(0, 30) || 'Bookmark',
    )}`;
  };

  // === LOGIC GIỐNG ARTICLECARD ===
  const mediaUrlValue = mediaUrl || '';
  const rawMediaType = mediaType || '';
  const mediaTypeValue = typeof rawMediaType === 'string' ? rawMediaType.toLowerCase() : '';
  
  // Kiểm tra video type
  const isVideoType = mediaTypeValue === 'video';
  
  // Kiểm tra GIF từ URL
  const isGif = mediaUrlValue.toLowerCase().includes('.gif');
  
  // Tin tưởng mediaType='video' từ backend, thử video tag trước
  // Nếu là GIF thì dùng Image tag (giống ArticleCard)
  const shouldUseVideoTag = isVideoType && !isGif && !mediaError;

  const posterUrl = thumbnailUrl || getFallbackUrl();

  // Debug logging
  React.useEffect(() => {
    console.log('BookmarkCard Render:', {
      id,
      title,
      rawMediaType,
      mediaTypeValue,
      isVideoType,
      mediaUrlValue,
      isGif,
      shouldUseVideoTag,
      thumbnailUrl,
      hasMediaUrl: !!mediaUrlValue,
    });
  }, [id, title, rawMediaType, mediaTypeValue, isVideoType, mediaUrlValue, isGif, shouldUseVideoTag, thumbnailUrl]);

  return (
    <Box
      as={RouterLink}
      to={`/articles/${id}`}
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      transition="all 0.25s ease"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
      display="flex"
      flexDirection="column"
      textDecoration="none"
    >
      <Box position="relative" h="180px" overflow="hidden" bg="gray.100">
        {shouldUseVideoTag ? (
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            src={mediaUrlValue}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            onError={() => {
              console.warn('BookmarkCard: Video load failed, falling back to image:', title);
              setMediaError(true);
            }}
            onLoadedData={(e) => {
              e.target.play().catch((err) => {
                console.warn('BookmarkCard: Video autoplay failed:', err);
              });
            }}
          />
        ) : (
          <Image
            src={mediaError ? posterUrl : (mediaUrlValue || getFallbackUrl())}
            alt={title}
            w="full"
            h="full"
            objectFit="cover"
            fallbackSrc={getFallbackUrl()}
            onError={(e) => {
              console.warn('BookmarkCard: Image load failed:', title);
              e.target.src = getFallbackUrl();
            }}
            loading="lazy"
          />
        )}
        
        {/* Category Badge */}
        <Badge
          position="absolute"
          top="4"
          left="4"
          colorScheme={
            category === 'Thể thao' ? 'green' :
            category === 'Giải trí' ? 'pink' :
            category === 'Kinh doanh' ? 'blue' :
            category === 'Sức khỏe' ? 'red' :
            category === 'Gia đình' ? 'purple' :
            category === 'Công nghệ' ? 'cyan' : 'orange'
          }
          borderRadius="full"
          px="3"
          py="1"
          fontWeight="semibold"
          fontSize="xs"
          textTransform="uppercase"
        >
          {category}
        </Badge>

        {/* Video indicator badge */}
        {isVideoType && !mediaError && (
          <Badge
            position="absolute"
            bottom="4"
            right="4"
            bg="blackAlpha.700"
            color="white"
            fontSize="xs"
            px="2"
            py="1"
            borderRadius="md"
          >
            ▶ Video
          </Badge>
        )}
      </Box>

      <VStack spacing="3" align="stretch" p="4" flex="1">
        <Text fontWeight="bold" fontSize="lg" noOfLines={2} color="gray.800">
          {title}
        </Text>
        {summary && (
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {summary}
          </Text>
        )}

        <HStack spacing="3" color="gray.500" fontSize="sm" mt="auto">
          <HStack spacing="1.5">
            <Icon as={Clock} boxSize={4} />
            <Text>{readTime}</Text>
          </HStack>
          <Text>•</Text>
          <Text>{publishedAt}</Text>
        </HStack>

        <Button
          variant="ghost"
          alignSelf="flex-start"
          colorScheme="blue"
          size="sm"
          rightIcon={<ArrowRight size={16} />}
        >
          Đọc tiếp
        </Button>
      </VStack>
    </Box>
  );
};

export default BookmarkCard;