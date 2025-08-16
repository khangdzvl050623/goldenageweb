// src/features/articles/components/ArticleBookmarkButton.jsx
import React from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';

/**
 * A standalone bookmark button for an article.
 * @param {{article: {id: string, title: string, content: string, mediaUrl: string}}} props
 */
const ArticleBookmarkButton = ({ article }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const toast = useToast();

  // Truyền userId trực tiếp vào useBookmarks
  const { isBookmarked, addBookmark, removeBookmark, isLoading: isBookmarksLoading } = useBookmarks(user?.uid);

  const isArticleBookmarked = isBookmarked(article.id);
  const isAuthenticated = !!user;
  const isLoading = isAuthLoading || isBookmarksLoading;

  const handleBookmarkClick = (e) => {
    // Ngăn chặn sự kiện mặc định của trình duyệt.
    e.preventDefault();
    // Ngăn chặn sự kiện lan truyền lên các component cha.
    // Đây là bước quan trọng để tránh click vào thẻ bài viết.
    e.stopPropagation();

    // Hiển thị thông báo nếu người dùng chưa đăng nhập.
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

    // Xử lý logic thêm hoặc xóa bookmark.
    if (isArticleBookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  return (
    <IconButton
      aria-label="Bookmark bài viết"
      icon={isArticleBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      size="sm"
      variant="ghost"
      colorScheme={isArticleBookmarked ? "blue" : "gray"}
      isDisabled={isLoading || !isAuthenticated}
      onClick={handleBookmarkClick}
    />
  );
};

export default ArticleBookmarkButton;
