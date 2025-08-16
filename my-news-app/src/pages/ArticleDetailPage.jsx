// src/pages/ArticleDetailPage.jsx
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Center,
  VStack,
  Alert,
  AlertIcon,
  Link as ChakraLink
} from '@chakra-ui/react'; // Thêm ChakraLink

const ArticleDetailPage = () => {
  const {id} = useParams(); // Lấy 'id' từ URL (ví dụ: /articles/123 -> id = 123)
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Đảm bảo URL này khớp với endpoint backend của bạn
        // và sử dụng biến `id` đúng cách.
        const response = await fetch(`https://goldenages.online/api/scrape/history/${id}`);
        // Nếu backend của bạn deploy ở một domain khác, hãy đổi URL này:
        // const response = await fetch(`https://your-deployed-backend-domain.com/api/scrape/history/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article not found.");
          }
          throw new Error(`Failed to fetch article with ID ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article detail:", err);
        setError(err.message || "Failed to load article details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]); // Chạy lại khi ID thay đổi

  if (loading) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Spinner size="xl" color="teal.500"/>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Alert status="error" width="auto" maxWidth="500px">
          <AlertIcon/>
          <Text>{error}</Text>
        </Alert>
      </Center>
    );
  }

  if (!article) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Text fontSize="xl">Article not found or invalid ID.</Text>
      </Center>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" py={8} px={4}>
      <VStack spacing={6} align="start">
        <Heading as="h1" size="xl" color="gray.800">
          {article.title}
        </Heading>

        {/* Hiển thị ảnh hoặc video chính của bài báo */}
        {article.mediaUrl && (
          <Box borderRadius="md" overflow="hidden" w="full">
            {article.mediaType === 'video' ? (
              <video
                style={{width: '100%', maxHeight: '400px', objectFit: 'cover'}}
                controls
                src={article.mediaUrl}
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            ) : (
              <Image
                src={article.mediaUrl}
                alt={article.title}
                maxH="400px"
                objectFit="cover"
                w="full"
              />
            )}
          </Box>
        )}

        {/* Mô tả chi tiết hoặc nội dung bài báo */}
        {article.description && (
          <Text fontSize="lg" color="gray.700">
            {article.description}
          </Text>
        )}

        {/* Các thông tin khác bạn muốn hiển thị */}
        {article.time && ( // Giả sử 'time' là trường thời gian trong Article modal của bạn
          <Text fontSize="sm" color="gray.500">
            Published: {new Date(article.time).toLocaleString()}
          </Text>
        )}
        {article.link && ( // Link gốc của bài báo
          <ChakraLink href={article.link} isExternal color="blue.500" fontWeight="semibold">
            Read original article <Text as="span" ml="2px">↗</Text>
          </ChakraLink>
        )}
        {/* Bạn có thể thêm tác giả, tags, reactions ở đây nếu backend cung cấp */}
        {/* Ví dụ:
        {article.author && (
          <Text fontSize="sm" color="gray.500">Author: {article.author}</Text>
        )}
        {article.tags && article.tags.length > 0 && (
          <HStack spacing={2}>
            {article.tags.map((tag, index) => <Tag key={index} size="sm" colorScheme="purple">#{tag}</Tag>)}
          </HStack>
        )}
        */}
      </VStack>
    </Box>
  );
};

export default ArticleDetailPage;
