// src/components/layout/ActivitySidebar.jsx
import { Box, VStack, Text, Badge, Divider, Heading } from '@chakra-ui/react';
import { MessageCircle, Bookmark, Share2, Clock } from 'lucide-react';

const ActivitySidebar = () => {
  const activities = [
    { type: 'comment', text: 'Tin tức thể thao', time: '2 phút trước', icon: MessageCircle, color: 'blue' },
    { type: 'save', text: 'Công nghệ AI', time: '1 giờ trước', icon: Bookmark, color: 'green' },
    { type: 'share', text: 'Kinh tế Việt Nam', time: '3 giờ trước', icon: Share2, color: 'purple' },
  ];

  return (
    <Box w="300px" p="6" bg="white" borderLeft="1px" borderColor="gray.200">
      <Heading size="md" mb="4" display="flex" alignItems="center" gap="2">
        <Clock size={20} />
        Hoạt động gần đây
      </Heading>

      <VStack align="stretch" spacing="4">
        {activities.map((act, i) => (
          <Box key={i} display="flex" gap="3" alignItems="flex-start">
            <Box
              p="2"
              bg={`${act.color}.50`}
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <act.icon size={16} color={`var(--chakra-colors-${act.color}-600)`} />
            </Box>
            <Box flex="1">
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {act.type === 'comment' && 'Bình luận về '}
                {act.type === 'save' && 'Lưu bài viết '}
                {act.type === 'share' && 'Chia sẻ '}
                <Box as="span" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                  {act.text}
                </Box>
              </Text>
              <Text fontSize="xs" color="gray.500">{act.time}</Text>
            </Box>
          </Box>
        ))}
      </VStack>

      <Divider my="6" />

      <Box>
        <Heading size="sm" mb="3">Thống kê</Heading>
        <VStack align="stretch" spacing="2" fontSize="sm">
          <Box display="flex" justifyContent="space-between">
            <Text color="gray.600">Bài viết hôm nay</Text>
            <Badge colorScheme="blue">24</Badge>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Text color="gray.600">Người dùng hoạt động</Text>
            <Badge colorScheme="green">1,234</Badge>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default ActivitySidebar;
