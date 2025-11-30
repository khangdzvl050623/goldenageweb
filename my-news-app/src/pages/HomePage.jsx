// src/pages/HomePage.jsx
import { Box, VStack, Divider } from '@chakra-ui/react';
import HeroSection from '../components/layout/HeroSection';
import ArticleFeed from '../features/articles/components/ArticleFeed';



const HomePage = () => {
  return (
    <VStack spacing="8" align="stretch" w="100%">
      {/* <Divider /> */}

      {/* FEED */}
      <ArticleFeed />

    </VStack>
  );
};

export default HomePage;
