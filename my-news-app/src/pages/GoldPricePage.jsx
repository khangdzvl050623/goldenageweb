import React, {useMemo} from 'react';
import {
  Box,
  Heading,
  Text,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Stack,
  Image,
  Link as ChakraLink,
} from '@chakra-ui/react';
import {useGoldData} from '../features/financial/hooks/useGoldData';
import GoldPriceTable from '../components/financial/GoldPriceTable.jsx';
import {useSearchContext} from '../contexts/SearchContext.jsx';
import {Link as RouterLink} from 'react-router-dom';

const GoldPricePage = () => {
  const {data, isLoading, error} = useGoldData();
  const {allArticles = []} = useSearchContext();

  const relatedArticles = useMemo(() => {
    return allArticles
      .filter((article) => {
        const title = article.title?.toLowerCase() || '';
        const content = article.content?.toLowerCase() || '';
        return title.includes('vàng') || content.includes('vàng');
      })
      .slice(0, 4);
  }, [allArticles]);

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="blue.500"/>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="60vh">
        <Alert status="error" borderRadius="lg">
          <AlertIcon/>
          {error}
        </Alert>
      </Center>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Center minH="60vh">
        <Alert status="info" borderRadius="lg">
          <AlertIcon/>
          Không có dữ liệu giá vàng.
        </Alert>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 160px)" py={{base: 6, md: 10}}>
      <Box maxW="1200px" mx="auto" px={{base: 4, md: 6}}>
        <VStack spacing={2} align="start" mb={8}>
          <Heading size="lg">Giá vàng hôm nay</Heading>
          <Text color="gray.600">
            Theo dõi bảng giá và biến động giá vàng theo thời gian thực.
          </Text>
        </VStack>

        <GoldPriceTable data={data} isLoading={false} error={null} showHeader={false}/>

        <Box mt={10}>
          <Heading size="md" mb={4}>
            Tin tức giá vàng hôm nay
          </Heading>
          {relatedArticles.length === 0 ? (
            <Alert status="info" borderRadius="lg">
              <AlertIcon/>
              Chưa có bài viết liên quan đến giá vàng.
            </Alert>
          ) : (
            <VStack align="stretch" spacing={4}>
              {relatedArticles.map((article) => (
                <Stack
                  key={article.id}
                  direction={{base: 'column', md: 'row'}}
                  spacing={4}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.100"
                  bg="white"
                  _hover={{shadow: 'md', borderColor: 'blue.100'}}
                >
                  <Image
                    src={article.mediaUrl}
                    alt={article.title}
                    borderRadius="lg"
                    objectFit="cover"
                    w={{base: '100%', md: '180px'}}
                    h="120px"
                    fallbackSrc="https://placehold.co/320x200?text=Gold"
                  />
                  <VStack align="start" spacing={2} flex="1">
                    <Heading as="h3" size="sm" color="gray.800">
                      <ChakraLink as={RouterLink} to={`/articles/${article.id}`} color="inherit">
                        {article.title}
                      </ChakraLink>
                    </Heading>
                    <Text color="gray.600" fontSize="sm" noOfLines={3}>
                      {article.content || 'Đọc thêm để biết chi tiết.'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Cập nhật: {article.publishedAt || 'Không rõ'}
                    </Text>
                  </VStack>
                </Stack>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GoldPricePage;

