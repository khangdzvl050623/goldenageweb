import {Box, Text, Flex, Link} from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" py={4} px={4} mt={8} bg="gray.800" color="white" textAlign="center">
      <Text fontSize="sm">
        © 2025 My News App. All rights reserved.
      </Text>
      <Flex justify="center" mt={2} wrap="wrap">
        <Link href="#" fontSize="sm" mx={2} _hover={{textDecoration: 'underline'}}>Privacy Policy</Link>
        <Link href="#" fontSize="sm" mx={2} _hover={{textDecoration: 'underline'}}>Terms of Service</Link>
        <Link href="#" fontSize="sm" mx={2} _hover={{textDecoration: 'underline'}}>Contact</Link>
      </Flex>
    </Box>
  );
};

export default Footer;
