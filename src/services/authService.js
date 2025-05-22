import http from '@/utils/http';
import { loginSuccess, logout } from '../pages/auth/redux/user.slice';
import { store } from '../redux/store';

let refreshTokenTimeout = null;

/**
 * Lưu thông tin xác thực vào localStorage và Redux, đồng thời đặt lại timer refresh token.
 * @param {Object} authData
 */
export const saveAuthData = (authData) => {
  // log các thông tin về thời gian hêt hạn token
  console.log('Lưu thông tin xác thực:', {
    access_token: authData?.access_token,
    refresh_token: authData?.refresh_token,
    expires_in: authData?.expires_in,
    refresh_expires_in: authData?.refresh_expires_in,
    token_created_at: authData?.token_created_at,
    refresh_token_created_at: authData?.refresh_token_created_at,
    username: authData?.username,
    is_active: authData?.is_active,
  });

  if (!authData?.access_token) {
    console.error('Thiếu access_token khi lưu thông tin xác thực:', authData);
    return;
  }

  const now = new Date();
  const userData = {
    access_token: authData.access_token,
    token: authData.access_token,
    refresh_token: authData.refresh_token,
    expires_in: Number(authData.expires_in) || 0,
    refresh_expires_in: Number(authData.refresh_expires_in) || 0,
    token_created_at: now.toISOString(),
    refresh_token_created_at: authData.refresh_token
      ? now.toISOString()
      : authData.refresh_token_created_at || now.toISOString(),
    username: authData.username,
    is_active: authData.is_active,
    ...authData,
  };

  localStorage.setItem('user', JSON.stringify(userData));
  store.dispatch(loginSuccess(userData));

  if (userData.expires_in > 0) {
    stopRefreshTokenTimer(); // Dừng timer cũ nếu có
    console.log('Đặt lịch refresh token tự động');
    startRefreshTokenTimer(userData);
  }
};

/**
 * Đặt lịch tự động refresh token trước khi hết hạn.
 * @param {Object} userData
 */
export const startRefreshTokenTimer = (userData) => {
  stopRefreshTokenTimer();

  const { expires_in, token_created_at } = userData;
  if (!expires_in || !token_created_at) return;

  const created = new Date(token_created_at).getTime();
  const expiresAt = created + expires_in * 1000;
  const now = Date.now();

  // Buffer: 60s hoặc 5% thời gian sống, chọn lớn hơn
  const buffer = Math.max(60 * 1000, expires_in * 1000 * 0.05);
  let timeout = expiresAt - now - buffer;

  timeout = Math.max(timeout, 10000); // time phải lớn hơn 10 giây

  console.log(`Đặt lịch refresh token sau ${Math.round(timeout / 1000)} giây`);

  refreshTokenTimeout = setTimeout(() => {
    refreshToken();
  }, timeout);
};

/**
 * Dừng timer refresh token.
 */
export const stopRefreshTokenTimer = () => {
  if (refreshTokenTimeout) {
    clearTimeout(refreshTokenTimeout);
    refreshTokenTimeout = null;
  }
};

// Biến để theo dõi thời gian gọi refresh token cuối cùng
let lastRefreshTime = 0;
// Khoảng thời gian tối thiểu giữa hai lần gọi refresh token (60 giây)
const MIN_REFRESH_INTERVAL = 60 * 1000;

/**
 * Thực hiện refresh token.
 * @returns {Promise<Object>} Trả về {rc, auth} để đảm bảo nhất quán với http.js
 */
export const refreshToken = async () => {
  try {
    const now = Date.now();

    // Kiểm tra xem đã gọi refresh gần đây hay chưa
    if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
      console.log(`Bỏ qua refresh token vì mới gọi cách đây ${Math.round((now - lastRefreshTime) / 1000)} giây`);
      return { rc: { code: -1, message: 'Refresh token throttled' }, auth: null };
    }

    // Cập nhật thời gian refresh token cuối cùng
    lastRefreshTime = now;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      handleLogout();
      return { rc: { code: -1, message: 'No user data found' }, auth: null };
    }

    const userData = JSON.parse(userStr);
    const { refresh_token, refresh_expires_in, refresh_token_created_at } = userData;

    // Kiểm tra refresh token hết hạn
    if (refresh_expires_in && refresh_token_created_at) {
      const expiredAt = new Date(refresh_token_created_at).getTime() + refresh_expires_in * 1000;
      if (Date.now() >= expiredAt) {
        console.warn('Refresh token đã hết hạn.');
        handleLogout();
        return { rc: { code: -1, message: 'Refresh token expired' }, auth: null };
      }
    }

    console.log('Gọi API refresh token...');
    const res = await http.post('/auth/user/refresh-token', { token: refresh_token });
    const { rc, auth } = res || {};

    if (rc?.code === 0 && auth?.access_token) {
      console.log('Refresh token thành công:', auth);

      // Kiểm tra thời gian hết hạn của token mới
      if (auth.expires_in && auth.expires_in < 120) {
        // nếu token mới chỉ có hiệu lực dưới 120 giây
        console.warn(`Token mới nhận được có thời hạn quá ngắn (${auth.expires_in}s), có thể có vấn đề với máy chủ.`);
      }

      const newUserData = {
        // Thông tin xác thực
        access_token: auth.access_token,
        token: auth.access_token,
        refresh_token: auth.refresh_token,
        expires_in: auth.expires_in,
        refresh_expires_in: auth.refresh_expires_in,
        token_created_at: new Date().toISOString(),
        refresh_token_created_at: new Date().toISOString(), // Thêm thời điểm tạo refresh token
        username: userData.username,
        is_active: userData.is_active,
      };

      saveAuthData(newUserData);
      console.log(`Token mới có hiệu lực ${auth.expires_in}s`);

      // Trả về cấu trúc nhất quán với http.js
      return { rc, auth };
    }

    // Nếu không thành công nhưng vẫn nhận được response
    return { rc: rc || { code: -1, message: 'Invalid response' }, auth: null };
  } catch (err) {
    console.error('Refresh token thất bại:', err);
    handleLogout();
    return { rc: { code: -1, message: err?.message || 'Unknown error' }, auth: null };
  }
};

/**
 * Đăng xuất: xóa localStorage, Redux và timer.
 */
export const handleLogout = () => {
  localStorage.removeItem('user');
  stopRefreshTokenTimer();
  store.dispatch(logout());
  return null;
};

/**
 * Khôi phục phiên đăng nhập từ localStorage, tự động refresh nếu cần.
 */
export const restoreAuthSession = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return;

  try {
    const userData = JSON.parse(userStr);
    if (!userData?.token) return;

    // Kiểm tra refresh token hết hạn
    if (userData.refresh_expires_in && userData.refresh_token_created_at) {
      const expiredAt = new Date(userData.refresh_token_created_at).getTime() + userData.refresh_expires_in * 1000;
      if (Date.now() >= expiredAt) {
        console.warn('Refresh token đã hết hạn khi khôi phục phiên.');
        return handleLogout();
      }
    }

    // Kiểm tra access token hết hạn
    if (userData.expires_in && userData.token_created_at) {
      const created = new Date(userData.token_created_at).getTime();
      const expiresAt = created + userData.expires_in * 1000;
      const now = Date.now();
      const timeLeft = expiresAt - now;

      console.log(`Khôi phục phiên: Token còn ${Math.round(timeLeft / 1000)}s`);

      if (timeLeft <= 0) {
        // Token đã hết hạn, cần refresh ngay
        console.log('Token đã hết hạn, cần refresh ngay');
        return refreshToken();
      } else if (timeLeft < 60 * 1000) {
        // Nếu token còn dưới 60 giây, refresh ngay để tránh hết hạn sớm
        console.log('Token còn ít hơn 60 giây, refresh để đảm bảo không gián đoạn');
        store.dispatch(loginSuccess(userData));
        refreshToken();
      } else {
        // Token còn đủ thời gian, đặt timer cho việc refresh
        store.dispatch(loginSuccess(userData));
        startRefreshTokenTimer(userData);
      }
    } else {
      // Không có thông tin về thời hạn token, vẫn đăng nhập và refresh ngay
      store.dispatch(loginSuccess(userData));
      refreshToken();
    }
  } catch (err) {
    console.error('Lỗi khi khôi phục phiên:', err);
    handleLogout();
  }
};

/**
 * Khởi tạo cơ chế lắng nghe sự kiện thay đổi localStorage giữa các tab để đồng bộ trạng thái đăng nhập.
 * Hàm này nên được gọi khi khởi động ứng dụng.
 */
export const setupAuthSync = () => {
  // Lắng nghe sự kiện storage change từ các tab khác
  window.addEventListener('storage', (event) => {
    if (event.key === 'user') {
      console.log('Phát hiện thay đổi user data từ tab khác');
      
      // Tab khác đăng xuất
      if (!event.newValue) {
        console.log('Đăng xuất từ tab khác, đồng bộ trạng thái');
        stopRefreshTokenTimer();
        store.dispatch(logout());
        return;
      }
      
      try {
        const newUserData = JSON.parse(event.newValue);
        const oldUserStr = localStorage.getItem('user');
        let oldUserData = null;
        
        if (oldUserStr) {
          try {
            oldUserData = JSON.parse(oldUserStr);
          } catch (e) {
            console.error('Lỗi parse oldUserData:', e);
          }
        }
        
        // Nếu token thay đổi, cập nhật trạng thái
        if (newUserData?.token && (!oldUserData || newUserData.token !== oldUserData.token)) {
          console.log('Token đã thay đổi từ tab khác, đồng bộ trạng thái');
          store.dispatch(loginSuccess(newUserData));
          stopRefreshTokenTimer();
          startRefreshTokenTimer(newUserData);
        }
      } catch (e) {
        console.error('Lỗi khi đồng bộ auth state giữa các tab:', e);
      }
    }
  });
};
