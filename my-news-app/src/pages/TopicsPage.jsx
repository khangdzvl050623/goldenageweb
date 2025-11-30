// src/pages/TopicsPage.jsx
import { Box, Heading, Text, Grid, GridItem, VStack, HStack, Image, Spinner, Center, Icon } from '@chakra-ui/react';
import { Hash, Clock } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useArticles } from '../features/articles/hooks/useArticles';
import { useMemo } from 'react';

// Utility function để tìm kiếm bài viết trong title và description/content
// Giống như logic trong useSearch
const searchArticles = (articles, query) => {
  if (!query || !query.trim() || !articles || articles.length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase().trim();
  
  return articles.filter((article) => {
    const title = (article.title || '').toLowerCase();
    const content = (article.content || article.description || '').toLowerCase();
    
    // Tìm kiếm trong title hoặc content/description
    return title.includes(queryLower) || content.includes(queryLower);
  });
};

// Component hiển thị một bài viết trong topic
const TopicArticleItem = ({ article }) => {
  const getFallbackUrl = () => {
    const title = article.title || 'Bài viết';
    const encoded = encodeURIComponent(title.slice(0, 20));
    return `https://placehold.co/200x120/E2E8F0/A0AEC0?text=${encoded}`;
  };

  return (
    <Box
      as={RouterLink}
      to={`/articles/${article.id}`}
      display="flex"
      gap="3"
      p="3"
      borderRadius="md"
      _hover={{ bg: 'gray.50' }}
      transition="all 0.2s"
      textDecoration="none"
    >
      <Box
        flexShrink={0}
        w="120px"
        h="80px"
        borderRadius="md"
        overflow="hidden"
        bg="gray.200"
      >
        <Image
          src={article.mediaUrl}
          alt={article.title}
          w="100%"
          h="100%"
          objectFit="cover"
          fallbackSrc={getFallbackUrl()}
          onError={(e) => {
            e.target.src = getFallbackUrl();
          }}
        />
      </Box>
      <VStack align="stretch" flex="1" spacing="1">
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.800"
          noOfLines={2}
          lineHeight="1.4"
        >
          {article.title}
        </Text>
        <HStack spacing="2" fontSize="xs" color="gray.500">
          <Text fontWeight="medium">Nguồn</Text>
          <Text>•</Text>
          <HStack spacing="1">
            <Icon as={Clock} boxSize={3} />
            <Text>{article.publishedAt}</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

// Component hiển thị một chủ đề với các bài viết
const TopicSection = ({ topicName, articles, color = 'blue' }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <Box mb="8">
      <Heading
        size="md"
        mb="4"
        color="gray.800"
        display="flex"
        alignItems="center"
        gap="2"
        fontWeight="bold"
      >
        <Icon as={Hash} boxSize={5} color={`${color}.500`} />
        {topicName}
      </Heading>
      <VStack align="stretch" spacing="0" border="1px solid" borderColor="gray.200" borderRadius="lg" overflow="hidden" bg="white">
        {articles.map((article, index) => (
          <Box key={article.id}>
            <TopicArticleItem article={article} />
            {index < articles.length - 1 && (
              <Box borderBottom="1px solid" borderColor="gray.100" />
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const TopicsPage = () => {
  const { allArticles, isLoading, error } = useArticles();

  // Định nghĩa các chủ đề với query string để search trong title và description
  const topicsConfig = useMemo(() => {
    const config = [
      {
        name: 'U22 TRUNG QUỐC',
        searchQuery: 'U22 Trung Quốc', // Query để tìm trong title và description
        color: 'green',
      },
      {
        name: 'LUẬT VIÊN CHỨC',
        searchQuery: 'luật viên chức',
        color: 'blue',
      },
      {
        name: 'KINH DOANH',
        searchQuery: 'kinh doanh',
        color: 'blue',
      },
      {
        name: 'THỂ THAO',
        searchQuery: 'thể thao',
        color: 'green',
      },
      {
        name: 'GIẢI TRÍ',
        searchQuery: 'giải trí',
        color: 'pink',
      },
      {
        name: 'SỨC KHỎE',
        searchQuery: 'sức khỏe',
        color: 'red',
      },
      {
        name: 'BÓNG ĐÁ',
        searchQuery: 'bóng đá',
        color: 'green',
      },
      {
        name: 'CÔNG NGHỆ',
        searchQuery: 'công nghệ',
        color: 'cyan',
      },
    ];

    // Group bài viết theo chủ đề bằng cách search trong title và description
    const groupedTopics = config.map((topic) => {
      // Sử dụng searchArticles để tìm kiếm giống như useSearch
      const matchingArticles = searchArticles(allArticles, topic.searchQuery);

      return {
        ...topic,
        articles: matchingArticles.slice(0, 5), // Giới hạn 5 bài mỗi chủ đề
      };
    });

    // Chỉ trả về các chủ đề có bài viết
    return groupedTopics.filter((topic) => topic.articles.length > 0);
  }, [allArticles]);

  // Chia topics thành 2 cột
  const leftColumnTopics = topicsConfig.filter((_, index) => index % 2 === 0);
  const rightColumnTopics = topicsConfig.filter((_, index) => index % 2 === 1);

  if (isLoading) {
    return (
      <Center minH="400px">
        <Spinner size="xl" color="blue.500" />
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
    <Box>
      <Heading size="xl" mb="6" color="gray.800">
        Chủ đề
      </Heading>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="8">
        {/* Cột trái */}
        <GridItem>
          <VStack align="stretch" spacing="0">
            {leftColumnTopics.map((topic) => (
              <TopicSection
                key={topic.name}
                topicName={topic.name}
                articles={topic.articles}
                color={topic.color}
              />
            ))}
          </VStack>
        </GridItem>

        {/* Cột phải */}
        <GridItem>
          <VStack align="stretch" spacing="0">
            {rightColumnTopics.map((topic) => (
              <TopicSection
                key={topic.name}
                topicName={topic.name}
                articles={topic.articles}
                color={topic.color}
              />
            ))}
          </VStack>
        </GridItem>
      </Grid>

      {topicsConfig.length === 0 && (
        <Center minH="400px">
          <Text color="gray.500">Chưa có chủ đề nào</Text>
        </Center>
      )}
    </Box>
  );
};

export default TopicsPage;

