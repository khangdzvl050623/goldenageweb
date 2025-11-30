// src/components/financial/GoldPriceTable.jsx
import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Text,
  Flex,
  Badge,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { useGoldData } from '../../features/financial/hooks/useGoldData';

const formatCurrency = (value) => {
  if (value === 'N/A') return value;
  const num = Number(value);
  if (!Number.isFinite(num)) return 'N/A';
  return num.toLocaleString('vi-VN');
};

const getTagColor = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('sjc')) return 'yellow';
  if (lower.includes('nhẫn')) return 'purple';
  if (lower.includes('miếng')) return 'orange';
  if (lower.includes('trang sức')) return 'pink';
  if (lower.includes('nữ trang')) return 'pink';
  if (lower.includes('nguyên liệu')) return 'teal';
  return 'gray';
};

const getGoldIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('nhẫn')) return '💍';
  if (lower.includes('trang sức') || lower.includes('nữ trang')) return '📿';
  if (lower.includes('miếng')) return '🥇';
  if (lower.includes('sjc')) return '🏆';
  return '✨';
};

const GoldPriceTable = ({
                          data: externalData,
                          isLoading: externalLoading,
                          error: externalError,
                          showHeader = true,
                        }) => {
  const { data: hookData, isLoading: hookLoading, error: hookError } = useGoldData();
  const goldData = externalData ?? hookData;
  const isLoading = externalLoading ?? hookLoading;
  const error = externalError ?? hookError;

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="yellow.500" thickness="4px" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="xl">
        <AlertIcon />
        <Text>Đã xảy ra lỗi khi tải dữ liệu giá vàng. Vui lòng thử lại sau.</Text>
      </Alert>
    );
  }

  if (!Array.isArray(goldData) || goldData.length === 0) {
    return (
      <Alert status="info" borderRadius="xl">
        <AlertIcon />
        <Text>Không có dữ liệu giá vàng.</Text>
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
            bgGradient="linear(to-br, yellow.400, orange.500)"
            color="white"
            boxShadow="0 4px 14px rgba(236, 201, 75, 0.4)"
          >
            <Icon as={Coins} boxSize={6} />
          </Box>
          <Box>
            <Heading as="h3" size="lg" color="gray.800">
              Giá vàng hôm nay
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Cập nhật {new Date().toLocaleDateString('vi-VN')} • Đơn vị: nghìn VNĐ/lượng
            </Text>
          </Box>
        </Flex>
      )}

      <TableContainer
        borderRadius="2xl"
        overflow="auto"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
        bg="white"
        maxH="500px"
        sx={{
          '&::-webkit-scrollbar': { width: '8px', height: '8px' },
          '&::-webkit-scrollbar-track': { bg: 'gray.100', borderRadius: 'full' },
          '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: 'full' },
        }}
      >
        <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
          <Thead position="sticky" top={0} zIndex={1}>
            <Tr bgGradient="linear(to-r, yellow.400, orange.400)">
              <Th
                color="white"
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
                py={4}
                borderBottom="none"
                minW="200px"
              >
                Loại vàng
              </Th>
              <Th
                isNumeric
                color="white"
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
                py={4}
                borderBottom="none"
                minW="140px"
              >
                Mua vào
              </Th>
              <Th
                isNumeric
                color="white"
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
                py={4}
                borderBottom="none"
                minW="140px"
              >
                Bán ra
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {goldData.map((item, index) => {
              const name = item.goldName || item.type || `Loại ${index + 1}`;
              const purchasePrice =
                item.purchasePrice !== undefined && item.purchasePrice !== null
                  ? formatCurrency(item.purchasePrice)
                  : 'N/A';
              const sellPrice =
                item.sellPrice !== undefined && item.sellPrice !== null
                  ? formatCurrency(item.sellPrice)
                  : 'N/A';

              const isEven = index % 2 === 0;

              return (
                <Tr
                  key={index}
                  bg={isEven ? 'white' : 'orange.50'}
                  _hover={{
                    bg: 'yellow.50',
                  }}
                  transition="all 0.2s ease"
                >
                  <Td py={4} borderColor="orange.100">
                    <HStack spacing={3}>
                      <Text fontSize="xl">{getGoldIcon(name)}</Text>
                      <Box>
                        <Text fontWeight="bold" color="gray.800" fontSize="sm" noOfLines={2}>
                          {name}
                        </Text>
                        <Badge
                          colorScheme={getTagColor(name)}
                          variant="subtle"
                          fontSize="xs"
                          borderRadius="full"
                          px={2}
                          mt={1}
                        >
                          {item.region || item.branch || 'Toàn quốc'}
                        </Badge>
                      </Box>
                    </HStack>
                  </Td>
                  <Td isNumeric py={4} borderColor="orange.100">
                    <HStack justify="flex-end" spacing={1}>
                      <Icon as={TrendingUp} color="green.500" boxSize={3} />
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="green.600"
                        fontFamily="mono"
                      >
                        {purchasePrice}
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric py={4} borderColor="orange.100">
                    <HStack justify="flex-end" spacing={1}>
                      <Icon as={TrendingDown} color="red.500" boxSize={3} />
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="red.500"
                        fontFamily="mono"
                      >
                        {sellPrice}
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
        * Giá tham khảo, có thể thay đổi theo thời điểm giao dịch thực tế
      </Text>
    </Box>
  );
};

export default GoldPriceTable;
