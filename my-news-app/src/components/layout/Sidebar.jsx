// src/components/layout/Sidebar.jsx
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { Box, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaHome, FaBookmark, FaTag, FaChartLine } from 'react-icons/fa';
import React from 'react';

const Sidebar = () => {
  const activeLinkColor = useColorModeValue('teal.600', 'teal.400');
  const inactiveLinkColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  const navItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Reading List', path: '/bookmarks', icon: FaBookmark }, // Cập nhật đường dẫn tới /bookmarks
    { name: 'Tags', path: '/tags', icon: FaTag },
    { name: 'Gold & Exchange Rates', path: '/financial', icon: FaChartLine },
  ];

  return (
    <Box as="nav" py={4}>
      <VStack align="stretch" spacing={2}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              borderRadius: 'md',
              padding: '8px 12px',
              backgroundColor: isActive ? hoverBgColor : 'transparent',
              color: isActive ? activeLinkColor : inactiveLinkColor,
              fontWeight: isActive ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
            })}
          >
            <item.icon style={{ marginRight: '12px' }} />
            <Text>{item.name}</Text>
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
