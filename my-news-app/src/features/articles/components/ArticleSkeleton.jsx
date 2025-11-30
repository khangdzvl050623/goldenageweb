import { Box, Skeleton, VStack, HStack, Center } from '@chakra-ui/react';

export const FeaturedSkeleton = () => (
  <Box maxW="full" w="full" px={{ base: 2, lg: 0 }}>
    <Skeleton height="400px" borderRadius="2xl" mb="4" />
    <Skeleton height="32px" width="80%" mx="auto" />
    <Skeleton height="20px" width="50%" mx="auto" mt="2" />
  </Box>
);

export const ArticleCardSkeleton = () => (
  <HStack spacing="4" maxW="3xl" mx="auto" p="2">
    <Skeleton width="140px" height="110px" borderRadius="xl" />
    <VStack align="start" flex="1" spacing="2">
      <Skeleton height="20px" width="85%" />
      <Skeleton height="20px" width="65%" />
      <Skeleton height="16px" width="40%" />
    </VStack>
  </HStack>
);
