import React, {useState} from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, Text, Link,
  VStack, Alert, AlertIcon, AlertDescription, Flex
} from '@chakra-ui/react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate(); // ✅ Gọi ở cấp component, không phải trong hàm

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://goldenages.online/api/users/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password}),
      });

      if (!response.ok) {
        throw new Error('Email không hợp lệ hoặc đã được sử dụng.');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setSuccess(true);

      // Tự động đăng nhập sau khi đăng ký thành công
      const loginResponse = await fetch('http://goldenages.online/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const token = loginData.accessToken || loginData.token; // ✅ Đọc đúng field
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {email: payload.sub, role: payload.role, name: payload.name};
        login(user, token); // AuthContext sẽ tự chuyển hướng
      } else {
        navigate('/login'); // Fallback: chuyển về trang login thủ công
      }

    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                Tạo tài khoản thành công!
              </AlertDescription>
            </Alert>
          )}

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
