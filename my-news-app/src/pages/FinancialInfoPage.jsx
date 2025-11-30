// src/pages/FinancialInfoPage.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Icon,
  VStack,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {DollarSign, Coins} from 'lucide-react';

const FinancialInfoPage = () => {
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={pageBg} minH="calc(100vh - 160px)" py={{base: 8, md: 12}}>
      <Box maxW="960px" mx="auto" px={{base: 4, md: 6}}>
        <VStack spacing={3} mb={8} textAlign="center">
          <Heading size="lg" color="gray.800">
            Tiện ích tài chính
        </Heading>
          <Text color="gray.500">
            Lựa chọn tiện ích bên dưới để khám phá thông tin chi tiết
            </Text>
        </VStack>

        <SimpleGrid columns={{base: 1, md: 2}} spacing={0} borderWidth="1px" borderColor={borderColor} borderRadius="xl" overflow="hidden">
          <UtilityCard
            title="Tỷ giá ngoại tệ"
            icon={DollarSign}
            to="/financial/exchange"
            borderRight={{base: 'none', md: `1px solid ${borderColor}`}}
            description="Cập nhật tỷ giá mới nhất"
          />
          <UtilityCard
            title="Giá vàng"
            icon={Coins}
            to="/financial/gold"
            description="Theo dõi giá vàng hằng ngày"
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

const UtilityCard = ({title, description, icon, to, borderRight}) => {
  return (
    <Box
      as={RouterLink}
      to={to}
      bg="white"
      py={10}
      px={4}
      textAlign="center"
      borderRight={borderRight}
      _hover={{bg: 'gray.50'}}
      transition="background 0.2s"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
    >
      <Icon as={icon} boxSize={16} color="teal.500" />
      <VStack spacing={1}>
        <Heading size="md" color="gray.800">
          {title}
        </Heading>
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

export default FinancialInfoPage;
