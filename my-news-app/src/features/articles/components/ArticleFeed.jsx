import {Box, VStack, Heading, Text} from '@chakra-ui/react';
import ArticleCard from './ArticleCard.jsx'; // Đảm bảo có .jsx


const ArticleFeed = ({articles}) => {


  if (!articles || articles.length === 0) {
    return <Text textAlign="center" py={10} color="gray.500">No articles found. Please check your API connection or data
      source.</Text>;
  }

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h1" size="lg">Latest Posts</Heading>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article}/>
      ))}
    </VStack>
  );
};

export default ArticleFeed;
