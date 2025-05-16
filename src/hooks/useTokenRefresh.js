import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken, setRefreshTokenTimer } from '@/pages/auth/redux/user.slice';

/**
 * Custom hook quản lý việc tự động refresh token
 * @param {number} refreshBeforeExpiry - Thời gian (ms) để refresh token trước khi hết hạn (mặc định: 5 phút)
 * @returns {Object} - Trạng thái của refresh token
 */
export const useTokenRefresh = (refreshBeforeExpiry = 5 * 60 * 1000) => {
  const dispatch = useDispatch();
  const { user, tokenExpiryTime, refreshTokenTimerId, isRefreshing } = useSelector(state => state.user);
  const timerRef = useRef(null);

  // Khởi tạo và quản lý timer refresh token
  useEffect(() => {
    // Hủy timer cũ nếu có
    const clearExistingTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (refreshTokenTimerId) {
        clearTimeout(refreshTokenTimerId);
      }
    };

    // Thiết lập timer mới nếu đủ điều kiện
    const setupNewTimer = () => {
      if (!user?.token || !tokenExpiryTime) return;
      
      const currentTime = Date.now();
      const timeUntilRefresh = tokenExpiryTime - currentTime - refreshBeforeExpiry;
      
      // Nếu token đã hết hạn hoặc sắp hết hạn, refresh ngay lập tức
      if (timeUntilRefresh <= 0) {
        dispatch(refreshAccessToken());
        return;
      }
      
      // Thiết lập timer để refresh trước khi token hết hạn
      const timerId = setTimeout(() => {
        dispatch(refreshAccessToken());
      }, timeUntilRefresh);
      
      // Lưu timer ID
      timerRef.current = timerId;
      dispatch(setRefreshTokenTimer(timerId));
    };

    clearExistingTimer();
    setupNewTimer();

    // Cleanup khi component unmount
    return clearExistingTimer;
  }, [dispatch, user, tokenExpiryTime, refreshBeforeExpiry]);

  // Hàm để buộc refresh token thủ công
  const forceRefresh = () => {
    dispatch(refreshAccessToken());
  };

  return {
    isRefreshing,
    tokenExpiryTime,
    forceRefresh,
  };
};

export default useTokenRefresh;