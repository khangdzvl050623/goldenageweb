import {useQuery} from '@tanstack/react-query';
import apiClient from '../../../api/apiClient.jsx';

export const useBookmarks = (userId) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await apiClient.get(`/bookmarks/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  return {
    bookmarks: data,
    isLoading,
    error,
    isBookmarked: (articleId) => data?.some((b) => b.articleId === articleId),
  };
};
