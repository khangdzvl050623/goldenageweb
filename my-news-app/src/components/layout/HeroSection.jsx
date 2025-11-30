// src/components/layout/HeroSection.jsx
import { Box, Heading, Text, Container, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const HeroSection = () => {
  return (
    <Box
      position="relative"
      bg="white"
      py={{ base: 12, md: 20 }}
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="-5%"
        w="300px"
        h="300px"
        bgGradient="radial(circle, rgba(56, 178, 172, 0.1) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(40px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="-5%"
        w="250px"
        h="250px"
        bgGradient="radial(circle, rgba(49, 151, 149, 0.08) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(40px)"
        zIndex={0}
      />

      <Container maxW="1200px" position="relative" zIndex={1}>
        <VStack spacing={6} textAlign="center" px={{ base: 4, md: 8 }}>
          {/* Main Heading */}
          <MotionHeading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="800"
            fontFamily="'Montserrat', sans-serif"
            letterSpacing="-0.02em"
            lineHeight="1.1"
            color="gray.800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tin tức toàn cầu
          </MotionHeading>

          {/* Gradient Heading */}
          <MotionHeading
            as="h2"
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="800"
            fontFamily="'Montserrat', sans-serif"
            letterSpacing="-0.02em"
            lineHeight="1.1"
            bgGradient="linear(to-r, teal.500, teal.600, cyan.500)"
            bgClip="text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            tại đầu ngón tay
          </MotionHeading>

          {/* Description */}
          <MotionText
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            color="gray.600"
            maxW="800px"
            lineHeight="1.8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Cập nhật những tin tức nóng nhất, mới nhất từ các lĩnh vực công nghệ, kinh tế, thế giới và nhiều hơn nữa
          </MotionText>

          {/* Decorative line */}
          <MotionBox
            w="80px"
            h="4px"
            bgGradient="linear(to-r, teal.400, cyan.400)"
            borderRadius="full"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;
