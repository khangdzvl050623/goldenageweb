// src/components/layout/AppHeader.jsx
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Link,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
  InputGroup,
  InputRightElement,
  IconButton,
  Heading,
  ListItem,
  UnorderedList,
  Spinner,
  Center,
  Avatar,
  MenuDivider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchContext } from '../../contexts/SearchContext';
import React from 'react';

const AppHeader = () => {
  const { user, logout } = useAuth();
  const {
    searchTerm,
    isSearching,
    suggestions,
    isFetchingSuggestions,
    handleSearchTermChange,
    executeSearch,
    handleSelectSuggestion,
    resetSearchState,
  } = useSearchContext();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
  };

  const handleSuggestionClick = (sugg) => {
    handleSelectSuggestion(sugg);
    executeSearch(sugg);
  };

  const handleHomeClick = () => {
    resetSearchState();
  };

  return (
    <Box bg="white" p={4} borderBottom="1px" borderColor="gray.200" boxShadow="sm">
      <Flex align="center" maxWidth="1200px" mx="auto">
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }} mr={4} onClick={handleHomeClick}>
          <Heading as="h1" size="lg" color="gray.800">HomePage</Heading>
        </Link>
        <Box flex="1" mx={4} maxWidth="400px" position="relative">
          <InputGroup size="md">
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') executeSearch(searchTerm);
              }}
              pr="3rem"
              borderRadius="md"
            />
            <InputRightElement width="3rem">
              <IconButton
                h="1.75rem"
                size="sm"
                onClick={() => executeSearch(searchTerm)}
                isLoading={isSearching}
                icon={<FaSearch />}
                aria-label="Search articles"
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
          {(searchTerm.length >= 2 && (suggestions?.length > 0 || isFetchingSuggestions)) && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="lg"
              mt={1}
              zIndex={10}
              maxHeight="200px"
              overflowY="auto"
            >
              {isFetchingSuggestions ? (
                <Center p={4}>
                  <Spinner size="sm" color="blue.500" />
                  <Text ml={2} fontSize="sm" color="gray.500">Đang tải gợi ý...</Text>
                </Center>
              ) : suggestions?.length > 0 ? (
                <UnorderedList listStyleType="none" m={0} p={0}>
                  {suggestions.map((sugg, index) => (
                    <ListItem
                      key={sugg || index}
                      p={2}
                      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                      onClick={() => handleSuggestionClick(sugg)}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <Text>{sugg}</Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Center p={4}>
                  <Text fontSize="sm" color="gray.500">Không có gợi ý nào.</Text>
                </Center>
              )}
            </Box>
          )}
        </Box>
        <Spacer />
        {user ? (
          <HStack spacing={4}>
            <Text fontWeight="semibold" color="gray.700" display={{ base: 'none', md: 'block' }}>Xin chào, {user.name || user.email}!</Text>
            <Menu>
              <MenuButton as={Button} size="sm" variant="outline" colorScheme="teal" rounded="full">
                <Avatar size="sm" name={user.name || user.email} />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">Thông tin cá nhân</MenuItem>
                <MenuDivider />
                {/* Loại bỏ Box bọc ngoài để Button có thể full width bên trong MenuList */}
                <Button onClick={handleLogout} colorScheme="red" variant="solid" w="full" m={0} borderRadius="none">
                  Đăng xuất
                </Button>
              </MenuList>
            </Menu>
          </HStack>
        ) : (
          <HStack spacing={2}>
            <Link as={RouterLink} to="/login">
              <Button variant="ghost" colorScheme="teal" size="sm">
                Log In
              </Button>
            </Link>
            <Link as={RouterLink} to="/register">
              <Button colorScheme="teal" size="sm">
                Create Account
              </Button>
            </Link>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default AppHeader;
