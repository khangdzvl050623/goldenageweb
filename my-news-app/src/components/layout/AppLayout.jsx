import {Box, Flex, Text, Grid, GridItem} from '@chakra-ui/react';
import React from 'react';
import {Outlet} from 'react-router-dom';

import Header from './AppHeader.jsx'; // Sửa lại thành Header
import Sidebar from './Sidebar.jsx';
import RightSidebar from './RightSidebar.jsx';
import Footer from './Footer.jsx'; // Thêm Footer

// AppLayout bây giờ chỉ bao bọc layout, không xử lý data
const AppLayout = () => {
  return (
    <Box>
      {/* Header / Navbar */}
      <Header/>

      {/* Main Content Area */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: '200px 1fr',
          lg: '240px 1fr 300px',
        }}
        gap={{base: 4, md: 6}}
        px={{base: 4, md: 8}}
        py={{base: 2, md: 4}}
        maxWidth="1280px"
        mx="auto"
      >
        {/* Left Sidebar */}
        <GridItem
          as="aside"
          colSpan={{base: 1, md: 1, lg: 1}}
          display={{base: 'none', md: 'block'}}
        >
          <Sidebar/>
        </GridItem>

        {/* Main Content - Hiển thị các trang con thông qua Outlet */}
        <GridItem as="main" colSpan={{base: 1, md: 1, lg: 1}}>
          <Outlet/>
        </GridItem>

        {/* Right Sidebar */}
        <GridItem
          as="aside"
          colSpan={{base: 1, md: 1, lg: 1}}
          display={{base: 'none', lg: 'block'}}
        >
          <RightSidebar/>
        </GridItem>
      </Grid>

      {/* Footer */}
      <Footer/>
    </Box>
  );
};

export default AppLayout;
