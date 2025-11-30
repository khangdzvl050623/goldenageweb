// src/components/layout/RightSidebar.jsx
import {useMemo} from 'react';
import {Box, VStack, Heading, Text, Badge, Divider, HStack, Icon, Skeleton, SkeletonText} from '@chakra-ui/react';
import {MessageCircle, Bookmark, Share2, Clock, TrendingUp, Activity, Cpu, HeartPulse} from 'lucide-react';
import {useSearchContext} from '../../contexts/SearchContext.jsx';

const topicColorMap = {
  'Thể thao': 'green',
  'Giải trí': 'pink',
  'Kinh doanh': 'blue',
  'Sức khỏe': 'red',
  'Gia đình': 'purple',
  'Công nghệ': 'cyan',
  'Tin tức': 'orange',
};

const topicIconMap = {
  'Thể thao': Activity,
  'Giải trí': Bookmark,
  'Kinh doanh': TrendingUp,
  'Sức khỏe': HeartPulse,
  'Gia đình': MessageCircle,
  'Công nghệ': Cpu,
  'Tin tức': Share2,
};

const formatRelativeTime = (dateTime) => {
  if (!dateTime) return 'Không rõ thời gian';
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'Vừa xong';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`;
  return `${Math.floor(diffMs / day)} ngày trước`;
};

const RightSidebar = () => {
  const {allArticles = [], isLoading} = useSearchContext();

  const {activities, todayCount, lastUpdatedAt} = useMemo(() => {
    if (!Array.isArray(allArticles) || allArticles.length === 0) {
      return {activities: [], todayCount: 0, lastUpdatedAt: null};
    }

    const now = new Date();
    const sortedArticles = allArticles
      .filter((article) => article?.dateTime && !Number.isNaN(new Date(article.dateTime).getTime()))
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    const todayCountCalc = sortedArticles.reduce((count, article) => {
      const date = new Date(article.dateTime);
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return count + 1;
      }
      return count;
    }, 0);

    const seenTopics = new Set();
    const activitiesCalc = [];

    for (const article of sortedArticles) {
      const topic = article.category || 'Tin tức';
      if (seenTopics.has(topic)) continue;
      seenTopics.add(topic);

      activitiesCalc.push({
        id: article.id,
        topic,
        title: article.title,
        time: formatRelativeTime(article.dateTime),
        icon: topicIconMap[topic] || MessageCircle,
        color: topicColorMap[topic] || 'blue',
      });

      if (activitiesCalc.length === 3) break;
    }

    const lastArticleDate = sortedArticles[0]?.dateTime
      ? new Date(sortedArticles[0].dateTime)
      : null;

    return {
      activities: activitiesCalc,
      todayCount: todayCountCalc,
      lastUpdatedAt: lastArticleDate && !Number.isNaN(lastArticleDate) ? lastArticleDate : null,
    };
  }, [allArticles]);

  return (
    <VStack spacing="6" align="stretch">
      {/* HOẠT ĐỘNG */}
      <Box>
        <Heading size="md" mb="4" display="flex" alignItems="center" gap="2">
          <Clock size={20}/>
          Hoạt động gần đây
        </Heading>
        {isLoading ? (
          <VStack align="stretch" spacing="3">
            {[...Array(3)].map((_, idx) => (
              <Box key={idx} borderRadius="lg" borderWidth="1px" borderColor="gray.100" p="3">
                <Skeleton height="16px" mb="2"/>
                <SkeletonText noOfLines={1} spacing="2" skeletonHeight="3"/>
              </Box>
            ))}
          </VStack>
        ) : (
          <VStack align="stretch" spacing="3">
            {activities.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                Chưa có dữ liệu bài viết.
              </Text>
            ) : (
              activities.map((act) => (
                <HStack key={act.id} spacing="3" align="start">
                  <Box p="2" bg={`${act.color}.50`} borderRadius="lg">
                    <Icon as={act.icon} boxSize={4} color={`${act.color}.600`}/>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">{act.topic}</Text>
                    
                    <Text fontSize="xs" color="gray.500">{act.time}</Text>
                  </Box>
                </HStack>
              ))
            )}
          </VStack>
        )}
      </Box>

      <Divider/>

      {/* THỐNG KÊ */}
      <Box>
        <Heading size="sm" mb="3" display="flex" alignItems="center" gap="2">
          <TrendingUp size={18}/>
          Thống kê theo ngày
        </Heading>
        {isLoading ? (
          <VStack align="stretch" spacing="2">
            <Skeleton height="18px"/>
            <Skeleton height="18px"/>
          </VStack>
        ) : (
          <VStack align="stretch" spacing="2" fontSize="sm">
            <HStack justify="space-between">
              <Text color="gray.600">Bài viết hôm nay</Text>
              <Badge colorScheme="blue">{todayCount}</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Cập nhật gần nhất</Text>
              <Badge colorScheme="purple">
                {lastUpdatedAt
                  ? lastUpdatedAt.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})
                  : '--'}
              </Badge>
            </HStack>
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default RightSidebar;
