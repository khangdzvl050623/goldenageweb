// src/features/articles/components/NewsletterBox.jsx
import { Box, Heading, Text, Button, Flex, Avatar, AvatarGroup, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, LogIn, CheckCircle } from 'lucide-react';
import FloatingElements from '../effects/FloatingElements.jsx';

const NewsletterBox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      py={{ base: 16, md: 24 }}
      px={0}
      bgGradient="linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
      w="100vw"
      ml="calc(-50vw + 50%)"
    >
      {/* 3D Floating Elements */}
      <FloatingElements />

      {/* Dark overlay để text dễ đọc hơn */}
      <Box
        position="absolute"
        inset="0"
        bg="blackAlpha.200"
        zIndex={1}
      />

      {/* Content */}
      <Box
        position="relative"
        zIndex={2}
        maxW="800px"
        mx="auto"
        px={{ base: 4, md: 8 }}
        color="white"
        textAlign="center"
      >
        {/* Badge */}
        <Box
          display="inline-flex"
          alignItems="center"
          gap={2}
          mb={6}
          px={5}
          py={2.5}
          bg="whiteAlpha.200"
          backdropFilter="blur(10px)"
          borderRadius="full"
          border="1px solid"
          borderColor="whiteAlpha.300"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        >
          <Icon as={Mail} boxSize={4} />
          <Text fontWeight="600" fontSize="sm" letterSpacing="wide">
            Nhận cập nhật hàng ngày
          </Text>
        </Box>

        {/* Heading with gradient text */}
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
          fontWeight="800"
          fontFamily="'Montserrat', sans-serif"
          letterSpacing="-0.02em"
          lineHeight="1.1"
          mb={4}
          color="white"
          textShadow="0 4px 20px rgba(0,0,0,0.3)"
        >
          Tin tức tươi mới
        </Heading>

        <Heading
          as="h3"
          fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
          fontWeight="800"
          fontFamily="'Montserrat', sans-serif"
          letterSpacing="-0.02em"
          lineHeight="1.3"
          mb={6}
          pb={2}
          bgGradient="linear(to-r, yellow.200, pink.200, white, cyan.200)"
          bgClip="text"
          sx={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          mỗi ngày trong hộp thư
        </Heading>

        <Text
          fontSize={{ base: 'md', md: 'xl' }}
          color="whiteAlpha.900"
          maxW="650px"
          mx="auto"
          mb={10}
          lineHeight="1.8"
          fontWeight="400"
        >
          Đừng bỏ lỡ các câu chuyện quan trọng. Chúng tôi sẽ gửi tin tức chọn lọc đến bạn lúc 8h sáng mỗi ngày.
        </Text>

        {/* CTA Button hoặc Status */}
        {!user ? (
          <Button
            onClick={handleLoginClick}
            size="lg"
            h="60px"
            px={10}
            bgGradient="linear(to-r, yellow.400, orange.400)"
            color="gray.900"
            fontWeight="bold"
            fontSize="lg"
            borderRadius="full"
            boxShadow="0 10px 40px rgba(255, 193, 7, 0.4)"
            _hover={{
              transform: 'translateY(-3px)',
              boxShadow: '0 15px 50px rgba(255, 193, 7, 0.6)'
            }}
            _active={{
              transform: 'translateY(-1px)'
            }}
            transition="all 0.2s"
            rightIcon={<LogIn size={20} />}
          >
            Đăng kí để nhận tin
          </Button>
        ) : (
          <Flex
            maxW="600px"
            mx="auto"
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="xl"
            p={5}
            align="center"
            justify="center"
            gap={3}
          >
            <Icon as={CheckCircle} boxSize={6} color="green.300" />
            <Text fontSize="md" fontWeight="500">
              Email sẽ được gửi tự động đến <Box as="span" fontWeight="700">{user.email}</Box> vào 8h sáng mỗi ngày
            </Text>
          </Flex>
        )}

        {/* Trust indicators */}
        <Flex
          mt={10}
          align="center"
          justify="center"
          gap={4}
          flexWrap="wrap"
        >
          <AvatarGroup size="md" max={3} spacing="-3">
            <Avatar
              name="User 1"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              border="3px solid"
              borderColor="whiteAlpha.400"
            />
            <Avatar
              name="User 2"
              bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              border="3px solid"
              borderColor="whiteAlpha.400"
            />
            <Avatar
              name="User 3"
              bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              border="3px solid"
              borderColor="whiteAlpha.400"
            />
          </AvatarGroup>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.900" fontWeight="500">
            <Box as="span" fontWeight="700">45K+</Box> người đã đăng ký. Không spam, hủy bất kỳ lúc nào.
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewsletterBox;
