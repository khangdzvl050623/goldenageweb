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
} from '@chakra-ui/react';
import { useGoldData } from '../../features/financial/hooks/useGoldData';

const GoldPriceTable = () => {
  const { data: goldData, isLoading, error } = useGoldData();

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        <Text>Đã xảy ra lỗi khi tải dữ liệu giá vàng. Vui lòng thử lại sau.</Text>
      </Alert>
    );
  }

  if (!Array.isArray(goldData) || goldData.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <Text>Không có dữ liệu giá vàng.</Text>
      </Alert>
    );
  }

  return (
    <Box p={4} borderRadius="lg" boxShadow="sm" bg="white">
      {/* Cập nhật tiêu đề sang tiếng Việt */}
      <Heading as="h3" size="md" mb={4} color="gray.700">Giá Vàng</Heading>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {/* Cập nhật các cột sang tiếng Việt */}
              <Th>Loại</Th>
              <Th isNumeric>Mua</Th>
              <Th isNumeric>Bán</Th>
            </Tr>
          </Thead>
          <Tbody>
            {goldData.map((item, index) => {
              // Bổ sung kiểm tra an toàn cho giá trị
              const purchasePrice = item.purchasePrice !== undefined && item.purchasePrice !== null ? item.purchasePrice : 'N/A';
              const sellPrice = item.sellPrice !== undefined && item.sellPrice !== null ? item.sellPrice : 'N/A';

              return (
                <Tr key={index}>
                  <Td fontWeight="semibold">{item.goldName || item.type}</Td>
                  <Td isNumeric>{purchasePrice}</Td>
                  <Td isNumeric>{sellPrice}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GoldPriceTable;
