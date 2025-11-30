
import {
  VStack,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  SimpleGrid,
  Badge,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Video, Film } from 'lucide-react';
import { useSearchContext } from '../contexts/SearchContext';
import ArticleCard from '../features/articles/components/ArticleCard';
import { ArticleCardSkeleton } from '../features/articles/components/ArticleSkeleton';

const VideosPage = () => {
  const {
    allArticles = [],
    isLoading,
    error,
  } = useSearchContext();

  // ✅ LỌC CHỈ LẤY BÀI VIẾT CÓ VIDEO
  const videoArticles = allArticles.filter((article) => {
    const mediaType = (article.mediaType || '').toLowerCase();
    const mediaUrl = article.mediaUrl || '';

    // Check nếu mediaType='video' HOẶC URL chứa video extensions
    return (
      mediaType === 'video' ||
      mediaUrl.includes('.mp4') ||
      mediaUrl.includes('.webm') ||
      mediaUrl.includes('.ogg') ||
      (mediaUrl.includes('.gif') && mediaUrl.includes('video'))
    );
  });

  // ================== LOADING STATE ==================
  if (isLoading) {
    return (
      <Container maxW="6xl" px={{ base: 0, md: 4 }} py={{ base: 4, md: 6 }}>
        <VStack spacing="10" align="stretch">
          <VStack spacing="5" align="stretch">
            {[...Array(6)].map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </VStack>
        </VStack>
      </Container>
    );
  }

  // ================== ERROR STATE ==================
  if (error) {
    return (
      <Container maxW="6xl" px={{ base: 4, md: 4 }} py={20}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Container>
    );
  }

  // ================== EMPTY STATE ==================
  if (videoArticles.length === 0) {
    return (
      <Container maxW="6xl" px={{ base: 4, md: 4 }} py={20}>
        <VStack spacing={6}>
          <Icon as={Film} boxSize={16} color="gray.300" />
          <Heading size="lg" color="gray.600">
            Chưa có video nào
          </Heading>
          <Text color="gray.500" textAlign="center">
            Hiện tại chưa có bài viết video nào trong hệ thống.
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" px={{ base: 0, md: 4 }} py={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 8, md: 12 }} align="stretch" w="full">
        {/* HEADER */}
        <Box
          textAlign={{ base: 'center', md: 'left' }}
          py={{ base: 2, md: 4 }}
          px={{ base: 4, md: 0 }}
        >
          <HStack
            display="inline-flex"
            alignItems="center"
            gap="2"
            bg="red.50"
            color="red.600"
            px="4"
            py="2"
            borderRadius="full"
            fontWeight="semibold"
            fontSize="sm"
            boxShadow="sm"
            mb={4}
          >
            <Video size={18} />
            <Text>Video Center</Text>
          </HStack>

          <Heading
            mt="4"
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            color="gray.800"
            fontWeight="extrabold"
          >
            Tin tức Video
          </Heading>

          <HStack mt="3" spacing={3}>
            <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="full">
              {videoArticles.length} videos
            </Badge>
            <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>
              Cập nhật những video tin tức mới nhất
            </Text>
          </HStack>
        </Box>

        {/* VIDEO GRID */}
        <Box px={{ base: 4, md: 0 }}>
          <VStack spacing={{ base: 4, md: 5 }} align="stretch" w="full">
            {videoArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default VideosPage;
