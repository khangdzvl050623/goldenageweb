import React, {useState} from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, Text, Link,
  VStack, Alert, AlertIcon, AlertDescription, Divider, HStack, Icon, Flex
} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {FaGithub, FaGoogle, FaApple} from 'react-icons/fa';
import {useAuth} from '../contexts/AuthContext'; // Import useAuth

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {login} = useAuth(); // Sử dụng hook useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // const response = await fetch('https://goldenages.online/api/users/login', {
      const response = await fetch('http://localhost:8383/api/users/login', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Giải mã token để lấy thông tin user cho Context
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const user = {email: payload.sub, role: payload.role, name: payload.name}; // Giả sử backend trả về name
      login(user, data.token); // Gọi hàm login từ AuthContext
      // Không cần alert hay navigate ở đây, hàm login đã xử lý
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... (Giữ nguyên giao diện như đã sửa) ...
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      w="100vw"
    >
      <Box
        p={{base: 4, md: 8}}
        maxWidth="500px"
        width="100%"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="xl"
        bg="white"
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="xl" textAlign="center" color="gray.800">
            Log in to My News App
          </Heading>

          {/* ... (Các nút social login, OR, error alert) ... */}

          <form onSubmit={handleSubmit}>
            <FormControl id="email" isRequired mb={4}>
              <FormLabel fontSize="sm" fontWeight="bold">Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                variant="filled"
                _focus={{borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500'}}
              />
            </FormControl>

            <FormControl id="password" isRequired mb={6}>
              <FormLabel fontSize="sm" fontWeight="bold">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                size="lg"
                variant="filled"
                _focus={{borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500'}}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
            >
              Log in
            </Button>
          </form>

          <Text textAlign="center" mt={4} fontSize="sm" color="gray.600">
            New to My News App?{' '}
            <Link as={RouterLink} to="/register" color="blue.600" fontWeight="bold">
              Create an account.
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
