import { VStack, Skeleton, Box } from '@chakra-ui/react';
import { FaHome, FaBookmark, FaTag, FaChartLine } from 'react-icons/fa';

const SidebarSkeleton = () => {
  return (
    <VStack align="stretch" spacing={2} p={4}>
      {[...Array(4)].map((_, i) => (
        <Box key={i} display="flex" alignItems="center" p="8px 12px" borderRadius="md">
          <Skeleton width="20px" height="20px" mr="12px" />
          <Skeleton height="20px" width="100px" />
        </Box>
      ))}
    </VStack>
  );
};

export default SidebarSkeleton;
