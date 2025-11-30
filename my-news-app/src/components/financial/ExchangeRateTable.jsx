// src/components/financial/ExchangeRateTable.jsx
import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  HStack,
  Badge,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// Currency flags/icons mapping
const currencyInfo = {
  USD: { name: 'Đô la Mỹ', flag: '🇺🇸' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  GBP: { name: 'Bảng Anh', flag: '🇬🇧' },
  JPY: { name: 'Yên Nhật', flag: '🇯🇵' },
  CNY: { name: 'Nhân dân tệ', flag: '🇨🇳' },
  KRW: { name: 'Won Hàn Quốc', flag: '🇰🇷' },
  SGD: { name: 'Đô la Singapore', flag: '🇸🇬' },
  THB: { name: 'Baht Thái', flag: '🇹🇭' },
  AUD: { name: 'Đô la Úc', flag: '🇦🇺' },
  CAD: { name: 'Đô la Canada', flag: '🇨🇦' },
  CHF: { name: 'Franc Thụy Sĩ', flag: '🇨🇭' },
  HKD: { name: 'Đô la Hong Kong', flag: '🇭🇰' },
  MYR: { name: 'Ringgit Malaysia', flag: '🇲🇾' },
  TWD: { name: 'Đô la Đài Loan', flag: '🇹🇼' },
  NZD: { name: 'Đô la New Zealand', flag: '🇳🇿' },
  DKK: { name: 'Krone Đan Mạch', flag: '🇩🇰' },
  INR: { name: 'Rupee Ấn Độ', flag: '🇮🇳' },
  KWD: { name: 'Dinar Kuwait', flag: '🇰🇼' },
  NOK: { name: 'Krone Na Uy', flag: '🇳🇴' },
  RUB: { name: 'Rúp Nga', flag: '🇷🇺' },
  SAR: { name: 'Riyal Ả Rập', flag: '🇸🇦' },
  SEK: { name: 'Krona Thụy Điển', flag: '🇸🇪' },
};

const ExchangeRateTable = ({ data, isLoading, error, showHeader = true }) => {
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="teal.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Text>{error}</Text>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        Không có dữ liệu tỷ giá.
      </Alert>
    );
  }

  return (
    <Box>
      {showHeader && (
        <Flex align="center" gap={3} mb={6}>
          <Box
            p={3}
            borderRadius="xl"
            bgGradient="linear(to-br, teal.400, teal.600)"
            color="white"
          >
            <Icon as={DollarSign} boxSize={6} />
          </Box>
          <Box>
            <Heading as="h3" size="lg" color="gray.800">
              Tỷ giá Hối đoái
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Cập nhật theo thời gian thực
            </Text>
          </Box>
        </Flex>
      )}

      <TableContainer
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
        bg="white"
      >
        <Table variant="simple" size="lg">
          <Thead>
            <Tr bgGradient="linear(to-r, teal.500, teal.600)">
              <Th
                color="white"
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
                py={5}
                borderBottom="none"
              >
                Ngoại tệ
              </Th>
              <Th
                isNumeric
                color="white"
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
                py={5}
                borderBottom="none"
              >
                Mua vào (VND)
              </Th>
              <Th
                isNumeric
                color="white"
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
                py={5}
                borderBottom="none"
              >
                Bán ra (VND)
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((rate, index) => {
              const info = currencyInfo[rate.currencyCode] || {
                name: rate.currencyCode,
                flag: '💱',
              };

              const buyValue =
                rate.buyRate !== undefined && rate.buyRate !== null
                  ? rate.buyRate.toLocaleString('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                  : 'N/A';

              const sellValue =
                rate.sellRate !== undefined && rate.sellRate !== null
                  ? rate.sellRate.toLocaleString('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                  : 'N/A';

              const isEven = index % 2 === 0;

              return (
                <Tr
                  key={rate.currencyCode || index}
                  bg={isEven ? 'white' : 'gray.50'}
                  _hover={{
                    bg: 'teal.50',
                    transform: 'scale(1.01)',
                  }}
                  transition="all 0.2s ease"
                  cursor="pointer"
                >
                  <Td py={5} borderColor="gray.100">
                    <HStack spacing={4}>
                      <Text fontSize="2xl">{info.flag}</Text>
                      <Box>
                        <HStack spacing={2}>
                          <Text fontWeight="bold" color="gray.800" fontSize="md">
                            {rate.currencyCode}
                          </Text>
                          <Badge
                            colorScheme="teal"
                            variant="subtle"
                            fontSize="xs"
                            borderRadius="full"
                            px={2}
                          >
                            1 {rate.currencyCode}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {info.name}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td isNumeric py={5} borderColor="gray.100">
                    <HStack justify="flex-end" spacing={2}>
                      <Icon as={TrendingUp} color="green.500" boxSize={4} />
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="green.600"
                        fontFamily="mono"
                      >
                        {buyValue}
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric py={5} borderColor="gray.100">
                    <HStack justify="flex-end" spacing={2}>
                      <Icon as={TrendingDown} color="red.500" boxSize={4} />
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="red.500"
                        fontFamily="mono"
                      >
                        {sellValue}
                      </Text>
                    </HStack>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Footer note */}
      <Text fontSize="xs" color="gray.400" mt={4} textAlign="center">
        * Tỷ giá tham khảo, có thể thay đổi theo thời điểm giao dịch thực tế
      </Text>
    </Box>
  );
};

export default ExchangeRateTable;
