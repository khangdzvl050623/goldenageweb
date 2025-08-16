// src/pages/FinancialInfoPage.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Center,
  Grid,
  Divider,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import ExchangeRateTable from '../components/financial/ExchangeRateTable';
import GoldPriceTable from '../components/financial/GoldPriceTable';

const FinancialInfoPage = () => {
  return (
    <Box>
      <Box p={8} maxWidth="1200px" mx="auto">
        <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.700">
          Financial Information
        </Heading>

        <Grid
          templateColumns={{base: "1fr", lg: "repeat(2, 1fr)"}}
          gap={6}
        >
          <ExchangeRateTable/>

          <GoldPriceTable/>

          <Box gridColumn={{base: "span 1", lg: "span 2"}} mt={8} p={4} borderRadius="lg" boxShadow="sm" bg="white">
            <Heading as="h3" size="md" mb={4} color="gray.700">Exchange Rate Chart (Coming Soon)</Heading>
            <Text color="gray.600">
              This area will display historical exchange rate charts.
            </Text>
          </Box>

          <Box gridColumn={{base: "span 1", lg: "span 2"}} mt={4} p={4} borderRadius="lg" boxShadow="sm" bg="white">
            <Heading as="h3" size="md" mb={4} color="gray.700">Gold Price Chart (Coming Soon)</Heading>
            <Text color="gray.600">
              This area will display historical gold price charts.
            </Text>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default FinancialInfoPage;
