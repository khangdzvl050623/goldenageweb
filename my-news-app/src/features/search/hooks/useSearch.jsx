import {useState, useEffect, useCallback, useRef} from 'react';
import axios from 'axios'; // Sử dụng axios để gọi API
import debounce from 'lodash.debounce'; // Import debounce từ lodash

const useSearch = (initialArticles = []) => {
  // State để lưu trữ từ khóa tìm kiếm trong ô input
  const [searchTerm, setSearchTerm] = useState('');
  // State để lưu trữ kết quả của tìm kiếm chính
  const [searchResults, setSearchResults] = useState(initialArticles);
  // State để chỉ ra liệu đang có một yêu cầu tìm kiếm chính đang được xử lý hay không
  const [isSearching, setIsSearching] = useState(false);
  // State để lưu trữ bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm chính
  const [searchError, setSearchError] = useState(null);

  // State mới: để lưu trữ danh sách các gợi ý từ API
  const [suggestions, setSuggestions] = useState([]);
  // State mới: để chỉ ra liệu đang có một yêu cầu lấy gợi ý đang được xử lý hay không
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  // useRef để lưu trữ hàm debounce và tránh việc tạo lại hàm này trong mỗi lần render
  // Hàm này sẽ gọi API gợi ý sau một khoảng thời gian người dùng ngừng gõ
  const fetchSuggestionsDebounced = useRef(
    debounce(async (query) => {
      // Chỉ gửi yêu cầu gợi ý nếu độ dài từ khóa >= 2 ký tự (có thể điều chỉnh)
      if (query.length < 2) {
        setSuggestions([]); // Xóa các gợi ý cũ nếu từ khóa quá ngắn
        return;
      }
      setIsFetchingSuggestions(true); // Đặt trạng thái đang tải gợi ý
      try {
        const response = await axios.get(`https://goldenages.online/api/scrape/suggestions?q=${encodeURIComponent(query)}`);
        setSuggestions(response.data); // Cập nhật danh sách gợi ý
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]); // Xóa gợi ý nếu có lỗi
      } finally {
        setIsFetchingSuggestions(false); // Kết thúc trạng thái tải gợi ý
      }
    }, 300) // Thời gian debounce là 300ms
  ).current;

  // Cleanup: Hủy bỏ hàm debounce khi component bị unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      fetchSuggestionsDebounced.cancel();
    };
  }, [fetchSuggestionsDebounced]); // Dependency array để đảm bảo cleanup đúng

  // Effect để cập nhật searchResults về initialArticles khi searchTerm rỗng
  // Điều này đảm bảo khi người dùng xóa từ khóa tìm kiếm, trang sẽ trở về trạng thái ban đầu
  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults(initialArticles || []); // initialArticles là danh sách bài viết ban đầu (trên trang chính)
      setSearchError(null); // Xóa lỗi tìm kiếm cũ
    }
  }, [initialArticles, searchTerm]); // Phụ thuộc vào initialArticles và searchTerm

  // Hàm chính để thực hiện tìm kiếm bài viết đầy đủ
  const executeSearch = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      // Nếu query rỗng, reset về initialArticles và không làm gì thêm
      setSearchResults(initialArticles || []);
      setSearchError(null);
      setIsSearching(false);
      setSuggestions([]); // Xóa gợi ý khi không có query
      return;
    }

    setIsSearching(true); // Đặt trạng thái đang tìm kiếm chính
    setSearchError(null); // Xóa lỗi tìm kiếm trước đó
    setSuggestions([]); // Xóa gợi ý khi đang thực hiện tìm kiếm chính thức
    try {
      // Gọi API backend cho tìm kiếm chính
      const response = await axios.get(`https://goldenages.online/api/scrape/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data); // Cập nhật kết quả tìm kiếm
    } catch (err) {
      setSearchError(err.message || 'An error occurred during search.');
      console.error("Search error:", err);
    } finally {
      setIsSearching(false); // Kết thúc trạng thái tìm kiếm
    }
  }, [initialArticles]); // initialArticles là dependency để khi reset về initialArticles thì đúng

  // Xử lý sự kiện thay đổi giá trị trong ô input tìm kiếm
  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value); // Cập nhật state searchTerm

    if (value === '') {
      // Nếu xóa từ khóa, reset trạng thái tìm kiếm
      executeSearch(''); // Sẽ đưa searchResults về initialArticles
    } else {
      // Nếu có từ khóa, gọi hàm debounce để lấy gợi ý
      fetchSuggestionsDebounced(value);
    }
  };

  // Xử lý khi người dùng chọn một gợi ý từ danh sách dropdown
  const handleSelectSuggestion = useCallback((suggestion) => {
    setSearchTerm(suggestion); // Cập nhật ô input với gợi ý đã chọn
    executeSearch(suggestion); // Thực hiện tìm kiếm chính thức với gợi ý đó
    setSuggestions([]); // Xóa danh sách gợi ý để nó không còn hiển thị
  }, [executeSearch]); // executeSearch là dependency

  // Trả về các state và hàm để các component khác có thể sử dụng
  return {
    searchTerm,
    setSearchTerm, // Có thể expose setter nếu cần reset từ bên ngoài
    searchResults,
    isSearching,
    searchError,
    suggestions,
    isFetchingSuggestions,
    handleSearchTermChange,
    executeSearch, // Hàm để gọi search thủ công (ví dụ: khi nhấn Enter)
    handleSelectSuggestion,
  };
};

export default useSearch;
