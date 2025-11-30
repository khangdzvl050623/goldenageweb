import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaBookmark, FaClock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchContext } from '../../contexts/SearchContext';
import React, { useMemo } from 'react';

const trendingTags = [
  '#WorldCup2024',
  '#AI Technology',
  '#Crypto News',
  '#Health Tips',
  '#Vietnam Economy',
];

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    searchTerm,
    isSearching,
    handleSearchTermChange,
    executeSearch,
    resetSearchState,
  } = useSearchContext();

  const formattedDate = useMemo(() => {
    const now = new Date();
    const weekdayRaw = now.toLocaleDateString('vi-VN', { weekday: 'long' });
    const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
    const datePart = now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${weekday}, ${datePart}`;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
  };

  const triggerSearch = () => {
    const term = searchTerm.trim();
    if (!term) return;
    executeSearch(term);
    navigate('/');
  };

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" boxShadow="sm">
      <Box maxW="1320px" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 4, md: 5 }}>
        <VStack align="stretch" spacing={4}>
          <Flex
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            flexWrap="wrap"
            rowGap={2}
            fontSize="sm"
            color="gray.600"
          >
            <HStack spacing={4}>
              <Text fontWeight="semibold">TP HCM • 29°C</Text>
              <Text>{formattedDate}</Text>
            </HStack>
            <HStack spacing={4}>
              <Link href="#" color="blue.500" fontWeight="medium">
                Bản tiếng Việt
              </Link>
              <Link href="#" color="gray.500">
                International
              </Link>
              <Link href="#" color="gray.500">
                Liên hệ tòa soạn
              </Link>
            </HStack>
          </Flex>

          <Flex
            align={{ base: 'flex-start', md: 'center' }}
            gap={6}
            flexWrap="wrap"
          >
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }} onClick={resetSearchState}>
              <VStack align="flex-start" spacing={0}>
                <Heading as="h1" size="lg" color="gray.800">
                  GoldenAge News
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Báo điện tử - Tin nhanh 24/7
                </Text>
              </VStack>
            </Link>

            <Box flex="1" minW={{ base: '100%', md: '360px' }}>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none" height="100%">
                  <FaSearch color="#A0AEC0" />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm bài viết, chủ đề, tác giả..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      triggerSearch();
                    }
                  }}
                  pl="3rem"
                  pr="3.5rem"
                  borderRadius="full"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.4)',
                    bg: 'white',
                  }}
                  _hover={{ bg: 'white' }}
                />
                <InputRightElement width="3.5rem" pr="1">
                  <IconButton
                    h="2.25rem"
                    w="2.25rem"
                    size="md"
                    onClick={triggerSearch}
                    isLoading={isSearching}
                    icon={<FaSearch />}
                    aria-label="Tìm kiếm bài viết"
                    variant="solid"
                    colorScheme="blue"
                    borderRadius="full"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>

            {user ? (
              <HStack spacing={4} ml="auto">
                <Text fontWeight="semibold" color="gray.700" display={{ base: 'none', md: 'block' }}>
                  Xin chào, {user.email}!
                </Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    rounded="full"
                    p={0}
                    minW="auto"
                    h="auto"
                    _hover={{
                      bg: 'gray.100',
                      transform: 'scale(1.05)',
                    }}
                    _active={{
                      bg: 'gray.200',
                      transform: 'scale(0.95)',
                    }}
                    transition="all 0.2s"
                  >
                    <Avatar size="md" name={user.email} cursor="pointer" />
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/bookmarks" icon={<FaBookmark />}>
                      Đã lưu
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/recent" icon={<FaClock />}>
                      Đọc gần đây
                    </MenuItem>
                    <MenuDivider />
                    <Button onClick={handleLogout} colorScheme="red" variant="solid" w="full" m={0} borderRadius="none">
                      Đăng xuất
                    </Button>
                  </MenuList>
                </Menu>
              </HStack>
            ) : (
              <HStack spacing={3} ml="auto">
                <Button as={RouterLink} to="/login" variant="ghost" colorScheme="teal" size="sm">
                  Đăng nhập
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="teal" size="sm">
                  Tạo tài khoản
                </Button>
              </HStack>
            )}
          </Flex>

          <Box bg="teal.500" borderRadius="md" px={4} py={2}>
            <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
              <HStack spacing={4}>
                <Button
                  variant="ghost"
                  color="white"
                  fontWeight="semibold"
                  size="sm"
                  _hover={{ bg: 'teal.600' }}
                  _active={{ bg: 'teal.700' }}
                >
                  NÓNG
                </Button>
                <Button
                  variant="ghost"
                  color="white"
                  fontWeight="semibold"
                  size="sm"
                  _hover={{ bg: 'teal.600' }}
                  _active={{ bg: 'teal.700' }}
                >
                  MỚI
                </Button>
                <Button
                  variant="ghost"
                  color="white"
                  fontWeight="semibold"
                  size="sm"
                  _hover={{ bg: 'teal.600' }}
                  _active={{ bg: 'teal.700' }}
                  as={RouterLink}
                  to="/videos"
                >
                  VIDEO
                </Button>
                <Button
                  variant="ghost"
                  color="white"
                  fontWeight="semibold"
                  size="sm"
                  _hover={{ bg: 'teal.600' }}
                  _active={{ bg: 'teal.700' }}
                  as={RouterLink}
                  to="/topics"
                >
                  CHỦ ĐỀ
                </Button>
              </HStack>
              <HStack spacing={3} flexWrap="wrap">
                {trendingTags.map((tag) => (
                  <Tag
                    key={tag}
                    size="md"
                    bg="white"
                    color="teal.600"
                    as={RouterLink}
                    to={`/tag/${tag.slice(1)}`}
                    variant="outline"
                    borderColor="white"
                    px={3}
                    py={1}
                    _hover={{ bg: 'teal.50', borderColor: 'white' }}
                    cursor="pointer"
                  >
                    {tag}
                  </Tag>
                ))}
                <IconButton
                  aria-label="Menu"
                  icon={<FaBars />}
                  variant="ghost"
                  color="white"
                  size="sm"
                  _hover={{ bg: 'teal.600' }}
                  _active={{ bg: 'teal.700' }}
                />
              </HStack>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default AppHeader;
