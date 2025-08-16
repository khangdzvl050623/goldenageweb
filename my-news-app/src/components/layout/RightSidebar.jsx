import { Box, Heading, Text, VStack, Link, Button } from '@chakra-ui/react'; // Đảm bảo import Button
import { Link as RouterLink } from 'react-router-dom'; // Sử dụng RouterLink nếu các link này dẫn đến route nội bộ

const RightSidebar = () => {
  return (
    <VStack align="stretch" spacing={6}>
      {/* Trending Posts Widget */}
      <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" boxShadow="sm">
        <Heading as="h3" size="sm" mb={3} color="gray.700">Trending Posts</Heading>
        <VStack align="stretch" spacing={2} fontSize="sm" color="blue.600">
          <Link as={RouterLink} to="#">How to use React Hooks effectively</Link>
          <Link as={RouterLink} to="#">Understanding CSS Grid Layout</Link>
          <Link as={RouterLink} to="#">Best practices for API design</Link>
        </VStack>
      </Box>

      {/* Call to Action / Join Community Widget */}
      <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" boxShadow="sm">
        <Heading as="h3" size="sm" mb={3} color="gray.700">Join the Community</Heading>
        <Text fontSize="sm" mb={2} color="gray.600">
          Sign up for exclusive content and discussions.
        </Text>
        <Button as={RouterLink} to="#" colorScheme="teal" size="sm" width="full">Learn More</Button> {/* width="full" để nút chiếm hết chiều rộng */}
      </Box>

      {/* Bạn có thể thêm các widget khác ở đây */}
      {/* Ví dụ:
      <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" boxShadow="sm">
        <Heading as="h3" size="sm" mb={3} color="gray.700">Advertisements</Heading>
        <Box bg="gray.100" p={4} minH="100px" display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="sm" color="gray.500">Your Ad Here</Text>
        </Box>
      </Box>
      */}
    </VStack>
  );
};

export default RightSidebar;
