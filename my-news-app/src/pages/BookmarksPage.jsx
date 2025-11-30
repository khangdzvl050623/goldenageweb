// src/pages/BookmarksPage.jsx
import React from 'react';
import {
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  Button,
  Icon,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bookmark, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useBookmarks } from '../features/articles/hooks/useBookmarks.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import BookmarkCard from '../features/articles/components/BookmarkCard.jsx';

const BookmarksPage = () => {
  const { user } = useAuth();
  const { bookmarks, isLoading, error } = useBookmarks(user?.id);

  const textColor = useColorModeValue('gray.800', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // === LOADING ===
  if (isLoading) {
    return (
      <Box w="100%" py={20} textAlign="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={subtextColor}>Đang tải danh sách...</Text>
        </VStack>
      </Box>
    );
  }

  // === ERROR ===
  if (error) {
    return (
      <Box w="100%" py={20} textAlign="center">
        <Alert status="error" borderRadius="xl" py={6} maxW="500px" mx="auto">
          <AlertIcon as={AlertCircle} />
          <Text fontSize="lg" fontWeight="medium">
            Không thể tải danh sách bookmark. Vui lòng thử lại sau.
          </Text>
        </Alert>
      </Box>
    );
  }

  // === CHƯA ĐĂNG NHẬP ===
  if (!user) {
    return (
      <Box w="100%" py={{ base: 12, md: 20 }} textAlign="center">
        <VStack spacing={8} maxW="500px" mx="auto" w="100%">
          <Box p={6} borderRadius="full" bg="gray.100">
            <Icon as={Bookmark} boxSize={{ base: 16, md: 20 }} color="gray.400" />
          </Box>
          <Heading size={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="bold">
            Đăng nhập để xem
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color={subtextColor} maxW="400px">
            Bạn cần đăng nhập để xem và quản lý danh sách bài viết đã lưu của mình.
          </Text>
          <Button
            as={RouterLink}
            to="/login"
            colorScheme="blue"
            size="lg"
            leftIcon={<Icon as={LogIn} boxSize={5} />}
            px={8}
          >
            Đăng nhập ngay
          </Button>
        </VStack>
      </Box>
    );
  }

  // === ĐÃ ĐĂNG NHẬP ===
  return (
    <Box w="100%" py={{ base: 6, md: 8 }}>
      <VStack spacing={8} align="stretch" w="100%">
        {/* HEADER */}
        <Box textAlign="center" pb={4}>
          <Badge 
            colorScheme="blue" 
            variant="subtle" 
            px="4" 
            py="1.5" 
            borderRadius="full" 
            fontSize="sm" 
            mb="4" 
            display="inline-flex" 
            alignItems="center"
            gap="2"
          >
            <Bookmark size={14} />
            Bộ sưu tập của bạn
          </Badge>
          <Heading 
            size={{ base: 'xl', md: '2xl' }} 
            color={textColor} 
            fontWeight="bold" 
            mb="3"
          >
            Bài viết đã lưu
          </Heading>
          <Text fontSize="md" color={subtextColor}>
            {bookmarks?.length || 0} bài viết đã lưu
          </Text>
        </Box>

        <Divider />

        {/* DANH SÁCH */}
        {bookmarks?.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            {bookmarks.map((bookmark) => {
              // Debug: xem bookmark data có những gì
              const articleData = {
                id: bookmark.articleId,
                title: bookmark.articleTitle,
                mediaUrl: bookmark.articleMediaUrl,
                mediaType: bookmark.articleMediaType || bookmark.mediaType,
                thumbnailUrl: bookmark.articleThumbnailUrl || bookmark.thumbnailUrl,
                category: bookmark.articleCategory || 'Tin tức',
                readTime: bookmark.articleReadTime || '3 phút đọc',
                publishedAt: bookmark.createdAt
                  ? new Date(bookmark.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'Chưa cập nhật',
                summary: bookmark.articleSummary || '',
              };
              
              // Debug logging chi tiết
              console.log('BookmarkCard Data:', {
                bookmarkRaw: bookmark,
                articleData: articleData,
                hasMediaType: !!(bookmark.articleMediaType || bookmark.mediaType),
                mediaTypeValue: bookmark.articleMediaType || bookmark.mediaType,
                hasMediaUrl: !!bookmark.articleMediaUrl,
                mediaUrl: bookmark.articleMediaUrl,
              });
              
              return (
                <BookmarkCard
                  key={bookmark.id || bookmark.articleId}
                  article={articleData}
                />
              );
            })}
          </SimpleGrid>
        ) : (
          <Box py={{ base: 16, md: 24 }} textAlign="center" w="100%">
            <VStack spacing={6} maxW="400px" mx="auto">
              <Box p={6} borderRadius="full" bg="gray.100">
                <Icon as={Bookmark} boxSize={16} color="gray.300" />
              </Box>
              <Heading size="lg" color={textColor} fontWeight="semibold">
                Chưa có bài viết nào
              </Heading>
              <Text color={subtextColor} fontSize="md">
                Khi bạn lưu bài viết yêu thích, chúng sẽ xuất hiện ở đây để bạn đọc lại sau.
              </Text>
              <Button 
                as={RouterLink} 
                to="/" 
                colorScheme="blue" 
                variant="outline"
                leftIcon={<ArrowLeft size={18} />}
                size="lg"
              >
                Khám phá bài viết
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default BookmarksPage;