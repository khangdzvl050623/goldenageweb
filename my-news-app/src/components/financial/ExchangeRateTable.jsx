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
} from '@chakra-ui/react';
import { useExchangeRateData } from '../../features/financial/hooks/useExchange-rateData.jsx';

const ExchangeRateTable = () => {
  const { data, isLoading, isError } = useExchangeRateData();

  if (isLoading) {
    return (
      <Center>
        <Spinner size="lg" color="teal.500" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Text>Đã xảy ra lỗi khi tải dữ liệu tỷ giá. Vui lòng thử lại sau.</Text>
      </Alert>
    );
  }

  // Kiểm tra xem data có tồn tại và là một mảng không
  if (!data || data.length === 0) {
    return <Text textAlign="center">Không có dữ liệu tỷ giá.</Text>;
  }

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Tỷ giá Hối đoái
      </Heading>
      <TableContainer borderRadius="lg" borderWidth="1px" overflow="hidden">
        <Table variant="simple" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>Mã tiền tệ</Th>
              <Th isNumeric>Mua</Th>
              <Th isNumeric>Bán</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((rate, index) => {
              // Sửa lỗi: sử dụng đúng thuộc tính buyRate và sellRate
              const buyValue = rate.buyRate !== undefined && rate.buyRate !== null ? rate.buyRate.toFixed(2) : 'N/A';
              const sellValue = rate.sellRate !== undefined && rate.sellRate !== null ? rate.sellRate.toFixed(2) : 'N/A';

              return (
                <Tr key={index}>
                  <Td fontWeight="medium">{rate.currencyCode}</Td>
                  <Td isNumeric>{buyValue}</Td>
                  <Td isNumeric>{sellValue}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExchangeRateTable;
