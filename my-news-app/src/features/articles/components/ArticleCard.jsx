// src/features/articles/components/ArticleCard.jsx
import { Box, Image, Text, Badge, HStack, Icon, Button, Flex } from '@chakra-ui/react';
import { Clock, ChevronRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import React, { useState } from 'react';
import ArticleBookmarkButton from './ArticleBookmarkButton';

const ArticleCard = ({ article }) => {
  const [mediaError, setMediaError] = useState(false);

  const getFallbackUrl = () => {
    const title = article.title || 'Bài viết';
    const encoded = encodeURIComponent(title.slice(0, 20));
    return `https://placehold.co/300x200/E2E8F0/A0AEC0?text=${encoded}`;
  };

  // Xử lý media type - tin tưởng backend
  const mediaUrl = article.mediaUrl || '';
  const mediaType = (article.mediaType || '').toLowerCase();
  
  // Ưu tiên mediaType từ backend, chỉ dùng video tag khi mediaType === 'video'
  // Nếu video load lỗi, sẽ fallback về image
  const isVideoType = mediaType === 'video';
  const shouldUseVideoTag = isVideoType && !mediaError;

  // Lấy thumbnail hoặc fallback
  const posterUrl = article.thumbnailUrl || getFallbackUrl();

  return (
    <Box
      as={RouterLink}
      to={`/articles/${article.id}`}
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="sm"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      cursor="pointer"
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      textDecoration="none"
      position="relative"
      w="full"
    >
      {/* Media Container */}
      <Box
        position="relative"
        flexShrink={0}
        w={{ base: '100%', md: '38%' }}
        maxW={{ md: '360px' }}
        h={{ base: '200px', md: '180px' }}
        overflow="hidden"
        bg="gray.100"
      >
        {shouldUseVideoTag ? (
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            src={mediaUrl}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            onError={() => {
              console.warn('Video load failed, falling back to image:', article.title);
              setMediaError(true);
            }}
            onLoadedData={(e) => {
              e.target.play().catch((err) => {
                console.warn('Video autoplay failed:', err);
              });
            }}
          />
        ) : (
          <Image
            src={mediaError ? posterUrl : (mediaUrl || getFallbackUrl())}
            alt={article.title}
            w="100%"
            h="100%"
            objectFit="cover"
            fallbackSrc={getFallbackUrl()}
            onError={(e) => {
              console.warn('Image load failed:', article.title);
              e.target.src = getFallbackUrl();
            }}
            loading="lazy"
          />
        )}
        
        {/* Category Badge */}
        <Badge
          position="absolute"
          top="3"
          left="3"
          colorScheme={
            article.category === 'Thể thao' ? 'green' :
            article.category === 'Giải trí' ? 'pink' :
            article.category === 'Kinh doanh' ? 'blue' :
            article.category === 'Sức khỏe' ? 'red' :
            article.category === 'Gia đình' ? 'purple' :
            article.category === 'Công nghệ' ? 'cyan' : 'orange'
          }
          fontSize="xs"
          fontWeight="bold"
          px="2"
          py="1"
          borderRadius="full"
        >
          {article.category}
        </Badge>

        {/* Video indicator badge (optional) */}
        {isVideoType && !mediaError && (
          <Badge
            position="absolute"
            bottom="3"
            right="3"
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

      {/* Content */}
      <Flex
        flex="1"
        p="5"
        flexDirection="column"
        justifyContent="space-between"
        position="relative"
      >
        <Box>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="bold"
            noOfLines={2}
            color="gray.800"
            mb="3"
            lineHeight="1.4"
          >
            {article.title}
          </Text>

          <HStack color="gray.500" fontSize="sm" spacing="2" mb="3">
            <HStack spacing="1">
              <Icon as={Clock} boxSize={4} />
              <Text>{article.readTime}</Text>
            </HStack>
            <Text>•</Text>
            <Text>{article.publishedAt}</Text>
          </HStack>
        </Box>

        <Flex justifyContent="space-between" alignItems="center" mt="auto">
          <Button
            variant="link"
            colorScheme="blue"
            rightIcon={<ChevronRight size={16} />}
            fontWeight="medium"
            fontSize="sm"
            p="0"
            onClick={(e) => e.stopPropagation()}
          >
            Đọc thêm
          </Button>
          <Box onClick={(e) => e.stopPropagation()}>
            <ArticleBookmarkButton article={article} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ArticleCard;