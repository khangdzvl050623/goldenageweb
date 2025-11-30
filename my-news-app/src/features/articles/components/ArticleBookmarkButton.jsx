// src/features/articles/components/ArticleBookmarkButton.jsx
import React from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient.jsx';

const ArticleBookmarkButton = ({ article }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { bookmarks, isLoading: isBookmarksLoading } = useBookmarks(user?.id);

  const isArticleBookmarked = bookmarks?.some(
    (bookmark) => bookmark.articleId === article.id
  );
  const isAuthenticated = !!user;
  const isLoading = isAuthLoading || isBookmarksLoading;

  // Mutation to add a bookmark
  const addBookmarkMutation = useMutation({
    mutationFn: (bookmarkData) => apiClient.post('/bookmarks', bookmarkData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks', user?.id]);
      toast({
        title: "Thành công!",
        description: "Đã thêm bài viết vào danh sách bookmark.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: (err) => {
      console.error("Lỗi khi thêm bookmark:", err);
      toast({
        title: "Lỗi",
        description: "Không thể thêm bookmark. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  // Mutation to remove a bookmark
  const removeBookmarkMutation = useMutation({
    mutationFn: () => apiClient.delete(`/bookmarks/${user?.id}/${article.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks', user?.id]);
      toast({
        title: "Thành công!",
        description: "Đã xóa bài viết khỏi danh sách bookmark.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: (err) => {
      console.error("Lỗi khi xóa bookmark:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa bookmark. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Đăng nhập để lưu bài viết",
        description: "Bạn phải đăng nhập để thêm bài viết vào bookmark.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isArticleBookmarked) {
      removeBookmarkMutation.mutate();
    } else {
      if (user && user.id) {
        // GỬI ĐẦY ĐỦ THÔNG TIN ARTICLE
        const bookmarkData = {
          userId: user.id,
          articleId: article.id,
          articleTitle: article.title,
          articleMediaUrl: article.mediaUrl,
          articleMediaType: article.mediaType,         // THÊM
          articleThumbnailUrl: article.thumbnailUrl,   // THÊM
          articleCategory: article.category,
          articleReadTime: article.readTime,
          articleSummary: article.summary || '',
        };
        
        // Debug: log dữ liệu gửi đi
        console.log('ArticleBookmarkButton: Saving bookmark with data:', {
          ...bookmarkData,
          hasMediaType: !!article.mediaType,
          mediaTypeValue: article.mediaType,
          hasThumbnailUrl: !!article.thumbnailUrl,
          fullArticle: article,
        });
        
        addBookmarkMutation.mutate(bookmarkData);
      } else {
        console.error("User ID is missing.");
        toast({
          title: "Lỗi",
          description: "Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <IconButton
      aria-label="Bookmark bài viết"
      icon={isArticleBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      size="sm"
      variant="ghost"
      colorScheme={isArticleBookmarked ? "blue" : "gray"}
      isDisabled={isLoading || addBookmarkMutation.isPending || removeBookmarkMutation.isPending}
      onClick={handleBookmarkClick}
    />
  );
};

export default ArticleBookmarkButton;