import React, {useState} from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, Text, Link,
  VStack, Alert, AlertIcon, AlertDescription, Divider, HStack, Icon, Flex
} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {FaGithub, FaGoogle, FaApple} from 'react-icons/fa';
import {useAuth} from '../contexts/AuthContext'; // Import useAuth

const RegisterPage = () => {
  const [name, setName] = useState(''); // Đảm bảo là 'name'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Giữ lại success state để hiển thị thông báo
  const {login} = useAuth(); // Sử dụng hook useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false); // Reset success state on new attempt
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://goldenages.online/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password}), // Đảm bảo gửi 'name'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed. Please try again.');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setSuccess(true); // Hiển thị thông báo thành công

      // Tùy chọn: Sau khi đăng ký thành công, tự động đăng nhập người dùng
      // Nếu bạn muốn người dùng tự đăng nhập sau khi đăng ký:
      const loginResponse = await fetch('https://goldenages.online/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const payload = JSON.parse(atob(loginData.token.split('.')[1]));
        const user = { email: payload.sub, role: payload.role, name: payload.name };
        login(user, loginData.token); // Tự động login và chuyển hướng
      } else {
        // Nếu không tự động login được, chuyển hướng về trang login
        navigate('/login');
      }

      // Hoặc nếu không tự động login, chỉ thông báo và để người dùng tự click login
      navigate('/login'); // Có thể chuyển hướng trực tiếp về trang login

    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... (Giữ nguyên giao diện như đã sửa) ...
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" w="100vw">
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
            Create your account
          </Heading>

          {/* ... (Các nút social login, OR, error/success alert) ... */}

          <form onSubmit={handleSubmit}>
            <FormControl id="name" isRequired mb={4}>
              <FormLabel fontSize="sm" fontWeight="bold">Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                size="lg"
                variant="filled"
                _focus={{borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500'}}
              />
            </FormControl>

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

            <FormControl id="password" isRequired mb={4}>
              <FormLabel fontSize="sm" fontWeight="bold">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                size="lg"
                variant="filled"
                _focus={{borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500'}}
              />
            </FormControl>

            <FormControl id="confirm-password" isRequired mb={6}>
              <FormLabel fontSize="sm" fontWeight="bold">Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
              Sign up
            </Button>
          </form>

          <Text textAlign="center" mt={4} fontSize="sm" color="gray.600">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.600" fontWeight="bold">
              Log in.
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
