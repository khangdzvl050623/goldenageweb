// src/app/AppLayout.jsx
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './AppHeader.jsx';
import Sidebar from './Sidebar.jsx';
import RightSidebar from './RightSidebar.jsx';
import Footer from './Footer.jsx';
import NewsletterBox from './NewsletterBox.jsx';
import HeroSection from './HeroSection.jsx';
import { useSearchContext } from '../../contexts/SearchContext.jsx';

const AppLayout = () => {
  const location = useLocation();
  const { activeSearchTerm } = useSearchContext();

  // Kiểm tra có đang search không
  const isSearching = activeSearchTerm && activeSearchTerm.trim() !== '';

  // Chỉ hiện HeroSection ở HomePage VÀ khi KHÔNG đang search
  const showHero = location.pathname === '/' && !isSearching;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      {/* HEADER - FULL WIDTH */}
      <Header />

      {/* HERO SECTION - FULL WIDTH (chỉ hiện ở HomePage khi không search) */}
      {showHero && (
        <Box w="100%" mt={0}>
          <HeroSection />
        </Box>
      )}

      {/* MAIN GRID - 3 CỘT */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: '180px 1fr',
          lg: '200px 1fr 220px',
        }}
        gap={{ base: 4, md: 4, lg: 5 }}
        px={{ base: 4, md: 4, lg: 5 }}
        py={{ base: 4, md: 6 }}
        flex="1"
        maxW="1500px"
        mx="auto"
        w="100%"
      >
        {/* LEFT SIDEBAR */}
        <GridItem
          display={{ base: 'none', md: 'block' }}
          minW={{ md: '180px', lg: '200px' }}
          maxW={{ md: '180px', lg: '200px' }}
          alignSelf="start"
        >
          <Sidebar />
        </GridItem>

        {/* MAIN CONTENT */}
        <GridItem
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          p={{ base: 4, md: 6, lg: 8 }}
          minH="60vh"
          flex="1 1 0%"
          minW="0"
          overflow="visible"
        >
          <Outlet />
        </GridItem>

        {/* RIGHT SIDEBAR */}
        <GridItem
          display={{ base: 'none', lg: 'block' }}
          minW="220px"
          maxW="220px"
          bg="white"
          borderRadius="xl"
          p="4"
          boxShadow="sm"
          position="sticky"
          top="100px"
          alignSelf="start"
        >
          <RightSidebar />
        </GridItem>
      </Grid>

      {/* NEWSLETTER BOX - FULL WIDTH - HIỆN Ở TẤT CẢ TRANG */}
      <Box w="100%" mt={0}>
        <NewsletterBox />
      </Box>

      {/* FOOTER - FULL WIDTH */}
      <Footer />
    </Box>
  );
};

export default AppLayout;
