// src/features/articles/hooks/useBookmarks.jsx
import { useState, useEffect } from 'react';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';

// Global variables injected by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Khởi tạo Firebase
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

/**
 * Custom hook for managing bookmarks.
 * @param {string} userId - The unique ID of the current authenticated user.
 * @returns {{
 * bookmarks: Array,
 * isLoading: boolean,
 * isBookmarked: Function,
 * addBookmark: Function,
 * removeBookmark: Function,
 * error: string | null
 * }}
 */
export const useBookmarks = (userId) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lắng nghe sự thay đổi của bookmarks
  useEffect(() => {
    // Chỉ chạy nếu có userId hợp lệ và database đã sẵn sàng
    if (!db || !userId) {
      setBookmarks([]);
      setIsLoading(false);
      return;
    }

    // Đường dẫn đến collection chứa bookmark của người dùng hiện tại
    const userBookmarksCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/bookmarks`);

    // Lắng nghe real-time các thay đổi
    const unsubscribe = onSnapshot(
      userBookmarksCollectionRef,
      (querySnapshot) => {
        const bookmarksData = [];
        querySnapshot.forEach((doc) => {
          bookmarksData.push(doc.data());
        });
        setBookmarks(bookmarksData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore snapshot error:", err);
        setError("Failed to fetch bookmarks.");
        setIsLoading(false);
      }
    );

    // Dọn dẹp listener khi component unmount
    return () => unsubscribe();
  }, [db, userId]); // Phụ thuộc vào db và userId

  /**
   * Checks if an article is bookmarked.
   * @param {string} articleId
   * @returns {boolean}
   */
  const isBookmarked = (articleId) => {
    return bookmarks.some((bookmark) => bookmark.id === articleId);
  };

  /**
   * Adds an article to bookmarks.
   * @param {{id: string, title: string, content: string, mediaUrl: string}} article
   */
  const addBookmark = async (article) => {
    if (!db || !userId) {
      setError("Authentication not ready or missing database.");
      return;
    }
    setIsLoading(true);
    try {
      // Đường dẫn tài liệu Firestore
      const bookmarkDocRef = doc(db, `artifacts/${appId}/users/${userId}/bookmarks`, article.id);
      await setDoc(bookmarkDocRef, article);
      setIsLoading(false);
    } catch (e) {
      console.error("Error adding bookmark: ", e);
      setError("Failed to add bookmark.");
      setIsLoading(false);
    }
  };

  /**
   * Removes an article from bookmarks.
   * @param {string} articleId
   */
  const removeBookmark = async (articleId) => {
    if (!db || !userId) {
      setError("Authentication not ready or missing database.");
      return;
    }
    setIsLoading(true);
    try {
      const bookmarkDocRef = doc(db, `artifacts/${appId}/users/${userId}/bookmarks`, articleId);
      await deleteDoc(bookmarkDocRef);
      setIsLoading(false);
    } catch (e) {
      console.error("Error removing bookmark: ", e);
      setError("Failed to remove bookmark.");
      setIsLoading(false);
    }
  };

  return { bookmarks, isLoading, isBookmarked, addBookmark, removeBookmark, error };
};
