// src/pages/ArticleDetailPage.jsx
import React, {useState, useEffect, useMemo} from 'react';
import {useParams, Link as RouterLink} from 'react-router-dom';
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
  Link as ChakraLink,
  HStack,
  Button,
  Stack,
  Tag,
  TagLabel,
  Grid,
  GridItem,
  Divider,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import {FaArrowLeft, FaClock, FaGlobeAsia, FaShareAlt, FaRegNewspaper} from 'react-icons/fa';
import {MdOutlineCategory} from 'react-icons/md';
import ArticleBookmarkButton from '../features/articles/components/ArticleBookmarkButton';

const ArticleDetailPage = () => {
  const {id} = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8383/api/scrape/history/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found.');
          }
          throw new Error(`Failed to fetch article with ID ${id}: ${response.statusText}`);
        }
        const data = await response.json();

        const normalizeArticle = (item) => {
          if (!item || typeof item !== 'object') return item;

          const rawDate =
            item.dateTime ||
            item.publishedAt ||
            item.createdAt ||
            item.updatedAt ||
            item.time ||
            null;

          const dateObj = rawDate ? new Date(rawDate) : null;
          const hasValidDate = dateObj && !isNaN(dateObj);

          return {
            ...item,
            dateTime: hasValidDate ? dateObj.toISOString() : null,
            publishedAtLabel: hasValidDate
              ? dateObj.toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : null,
            category: item.category || 'Tin tức',
          };
        };

        setArticle(normalizeArticle(data));
      } catch (err) {
        console.error('Error fetching article detail:', err);
        setError(err.message || 'Failed to load article details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]);

  const heroBg = useColorModeValue('white', 'gray.800');
  const metaCardBg = useColorModeValue('white', 'gray.800');
  const metaBorder = useColorModeValue('gray.100', 'gray.700');

  const contentSections = useMemo(() => {
    if (!article?.content && !article?.description) return [];
    const raw = article.content || article.description || '';
    return raw
      .split(/\n+/)
      .map((section) => section.trim())
      .filter((section) => section.length > 0);
  }, [article]);

  const readingMinutes = useMemo(() => {
    const contentText = article?.content || article?.description || '';
    if (!contentText) return null;
    return Math.max(1, Math.round(contentText.split(/\s+/).length / 200));
  }, [article]);

  if (loading) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Alert status="error" width="auto" maxWidth="500px">
          <AlertIcon />
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

  const metaCards = [
    {
      label: 'Thời gian xuất bản',
      value: article.publishedAtLabel || (article.dateTime ? new Date(article.dateTime).toLocaleString('vi-VN') : 'Không rõ'),
      icon: FaClock,
    },
    {
      label: 'Nguồn',
      value: article.source || 'GoldenAge News',
      icon: FaGlobeAsia,
    },
    {
      label: 'Chuyên mục',
      value: article.category || 'Tin tức',
      icon: MdOutlineCategory,
    },
    {
      label: 'Thời lượng đọc',
      value: readingMinutes ? `${readingMinutes} phút` : 'Không rõ',
      icon: FaRegNewspaper,
    },
  ];

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 160px)" py={{base: 8, md: 12}}>
      <Box maxW="960px" mx="auto" px={{base: 4, md: 6}}>
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          mb={6}
          colorScheme="blue"
          size="sm"
        >
          Quay lại trang chủ
        </Button>

        <VStack spacing={8} align="stretch">
          <Box bg={heroBg} borderRadius="2xl" p={{base: 6, md: 8}} shadow="xl">
            <Stack direction={{base: 'column', md: 'row'}} justify="space-between" spacing={6}>
              <VStack align="flex-start" spacing={4} flex="1">
                <Tag size="lg" colorScheme="blue" borderRadius="full">
                  <TagLabel textTransform="uppercase" fontWeight="bold">
                    {article.category || 'Tin tức'}
                  </TagLabel>
                </Tag>
                <Heading as="h1" size="xl" color="gray.800">
            {article.title}
          </Heading>
                {article.description && (
                  <Text color="gray.600" fontSize="lg">
                    {article.description}
                  </Text>
                )}
                <HStack spacing={4} color="gray.500" fontSize="sm">
                  <HStack spacing={2}>
                    <Icon as={FaClock} />
                    <Text>{metaCards[0].value}</Text>
                  </HStack>
                  {readingMinutes && (
                    <>
                      <Text>•</Text>
                      <HStack spacing={2}>
                        <Icon as={FaRegNewspaper} />
                        <Text>{readingMinutes} phút đọc</Text>
                      </HStack>
                    </>
                  )}
                </HStack>
              </VStack>
              <HStack spacing={3} alignSelf="flex-start">
                <Tooltip label="Chia sẻ bài viết">
                  <span>
                    <ShareButton link={article.link} />
                  </span>
                </Tooltip>
          <ArticleBookmarkButton article={article} />
        </HStack>
            </Stack>

        {article.mediaUrl && (
              <Box borderRadius="xl" overflow="hidden" mt={6}>
            {article.mediaType === 'video' ? (
              <video
                    style={{width: '100%', maxHeight: '460px', objectFit: 'cover'}}
                controls
                src={article.mediaUrl}
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            ) : (
              <Image
                src={article.mediaUrl}
                alt={article.title}
                    w="100%"
                    maxH="460px"
                objectFit="cover"
                    loading="lazy"
              />
            )}
          </Box>
        )}
          </Box>

          <Grid templateColumns={{base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)'}} gap={4}>
            {metaCards.map((card) => (
              <GridItem key={card.label}>
                <Box
                  bg={metaCardBg}
                  borderRadius="xl"
                  p={4}
                  borderWidth="1px"
                  borderColor={metaBorder}
                  shadow="md"
                >
                  <HStack spacing={3} mb={2}>
                    <Icon as={card.icon} color="blue.500" />
                    <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                      {card.label}
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" color="gray.800">
                    {card.value}
                  </Text>
                </Box>
              </GridItem>
            ))}
          </Grid>

          <Box bg={heroBg} borderRadius="2xl" p={{base: 6, md: 8}} shadow="lg">
            <Heading as="h2" size="lg" mb={4}>
              Nội dung bài viết
            </Heading>
            <Divider mb={6} />
            {contentSections.length > 0 ? (
              <VStack align="stretch" spacing={5}>
                {contentSections.map((section, idx) => (
                  <Text key={idx} fontSize="lg" color="gray.700" lineHeight="tall">
                    {section}
          </Text>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">Không có nội dung chi tiết cho bài viết này.</Text>
            )}
          </Box>

          {article.link && (
            <Box
              bg="blue.50"
              borderRadius="xl"
              p={6}
              border="1px solid"
              borderColor="blue.100"
              display="flex"
              flexDirection={{base: 'column', md: 'row'}}
              alignItems={{base: 'flex-start', md: 'center'}}
              justifyContent="space-between"
              gap={4}
            >
              <Box>
                <Heading as="h3" size="md" color="blue.700">
                  Đọc bài gốc
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Truy cập nguồn chính thức để xem đầy đủ thông tin và cập nhật mới nhất.
          </Text>
              </Box>
              <Button
                as={ChakraLink}
                href={article.link}
                isExternal
                colorScheme="blue"
                rightIcon={<Icon as={FaGlobeAsia} fontSize="sm" />}
                borderRadius="full"
                px={6}
                gap={2}
              >
                Đến trang nguồn
              </Button>
            </Box>
        )}
      </VStack>
      </Box>
    </Box>
  );
};

const ShareButton = ({link}) => {
  const shareLink = link || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Chia sẻ bài viết',
          text: 'Hãy xem bài viết thú vị này!',
          url: shareLink,
        })
        .catch(() => {
          window.open(shareLink, '_blank');
        });
    } else {
      window.open(shareLink, '_blank');
    }
  };

  return (
    <Button variant="outline" colorScheme="blue" borderRadius="full" leftIcon={<FaShareAlt />} onClick={handleShare}>
      Chia sẻ
    </Button>
  );
};

export default ArticleDetailPage;
