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

    // Xử lý trường hợp refresh token không thành công từ phía server hoặc response không hợp lệ
    if (rc) { // Server đã phản hồi, nhưng không thành công (rc.code !== 0)
        console.warn(`Refresh token không thành công từ server. Code: ${rc.code}, Message: ${rc.message}. Đăng xuất.`);
        handleLogout(); // Đảm bảo logout nếu server từ chối refresh token
        return { rc, auth: null }; // Trả về lỗi từ server
    }
    
    // Trường hợp không có rc (response không hợp lệ từ http client) hoặc các lỗi không mong muốn khác trước khi vào catch
    console.warn('Refresh token không thành công, không nhận được rc hợp lệ từ server hoặc response trống. Đăng xuất.');
    handleLogout(); // Logout như một biện pháp an toàn
    return { rc: { code: -1, message: 'Invalid or missing response from server during refresh' }, auth: null };

  } catch (err) {
    console.error('Refresh token thất bại (exception):', err);
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
 * @returns {Promise<boolean>} Trả về true nếu phiên được khôi phục thành công (có token hợp lệ), false ngược lại.
 */
export const restoreAuthSession = async () => {
  const userStringFromStorage = localStorage.getItem('user'); // Chỉ đọc chuỗi từ localStorage

  // console.log('Khôi phục phiên đăng nhập từ localStorage (chuỗi thô):', userStringFromStorage); // Log chuỗi thô để debug nếu cần
  if (!userStringFromStorage) {
    console.log('Không tìm thấy user data trong localStorage.');
    return false; // Không có session để khôi phục
  }else {
    console.log('Tìm thấy user data trong localStorage.');
    saveAuthData(JSON.parse(userStringFromStorage)); // Lưu lại thông tin xác thực vào Redux
  }

  try {
    const userData = JSON.parse(userStringFromStorage); // Parse chuỗi JSON thành object ở đây
    console.log('Khôi phục phiên đăng nhập từ localStorage (đã parse):', userData);



    // Kiểm tra sự tồn tại của access_token
    if (!userData?.access_token) {
      console.warn('Khôi phục phiên: không tìm thấy access_token trong userData. Đăng xuất.');
      handleLogout();
      return false; // Phiên không hợp lệ
    }

    // Kiểm tra refresh token hết hạn
    if (userData.refresh_expires_in && userData.refresh_token_created_at) {
      const expiredAt = new Date(userData.refresh_token_created_at).getTime() + userData.refresh_expires_in * 1000;
      if (Date.now() >= expiredAt) {
        console.warn('Refresh token đã hết hạn khi khôi phục phiên.');
        handleLogout();
        return false; // Refresh token hết hạn
      }
    }

    // Kiểm tra access token hết hạn
    if (userData.expires_in && userData.token_created_at) {
      const created = new Date(userData.token_created_at).getTime();
      const expiresAt = created + userData.expires_in * 1000;
      const now = Date.now();
      const timeLeft = expiresAt - now;

      console.log(`Khôi phục phiên: Access Token còn ${Math.round(timeLeft / 1000)}s`);

      if (timeLeft <= 0) {
        // Access Token đã hết hạn, cần refresh ngay
        console.log('Access Token đã hết hạn, cần refresh ngay');
        const refreshResult = await refreshToken();
        // Kiểm tra kết quả refresh: rc.code === 0 và có access_token mới
        return !!(refreshResult && refreshResult.rc?.code === 0 && refreshResult.auth?.access_token);
      } else {
        // Access Token còn hạn
        store.dispatch(loginSuccess(userData)); // Cập nhật Redux với token hiện tại
        if (timeLeft < 60 * 1000) {
          // Nếu token còn dưới 60 giây, refresh ngầm để không gián đoạn
          console.log('Access Token còn ít hơn 60 giây, refresh ngầm để đảm bảo không gián đoạn');
          refreshToken(); // Không cần await ở đây vì phiên đã được coi là hợp lệ
        } else {
          // Token còn đủ thời gian, đặt timer cho việc refresh
          startRefreshTokenTimer(userData);
        }
        return true; // Phiên hợp lệ với token hiện tại
      }
    } else {
      // Không có thông tin về thời hạn access token, thử refresh ngay
      console.log('Không có thông tin thời hạn access token, thử refresh ngay.');
      const refreshResult = await refreshToken();
      return !!(refreshResult && refreshResult.rc?.code === 0 && refreshResult.auth?.access_token);
    }
  } catch (err) {
    console.error('Lỗi khi khôi phục phiên:', err);
    handleLogout();
    return false; // Lỗi, coi như khôi phục thất bại
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
