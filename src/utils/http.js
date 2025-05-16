import axios from "axios";
import { store } from '../redux/store';
import { refreshAccessToken, logOut } from '@/pages/auth/redux/user.slice';

const axiosParams = {
  // Set different base URL based on the environment
  baseURL:
    process.env.NODE_ENV === "development" ? "http://10.7.0.4:8808" : "/",
};

// Create axios instance with default params
const axiosInstance = axios.create(axiosParams);

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue = [];

// Xử lý các request đang chờ sau khi refresh token thành công hoặc thất bại
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Hàm kiểm tra và thiết lập timer cho việc refresh token
const setupRefreshTokenTimer = () => {
  const state = store.getState();
  const { user, tokenExpiryTime, refreshTokenTimerId } = state.user;
  
  // Xóa timer cũ nếu có
  if (refreshTokenTimerId) {
    clearTimeout(refreshTokenTimerId);
  }
  
  // Nếu không có token hoặc thời gian hết hạn, không làm gì
  if (!user?.token || !tokenExpiryTime) return;
  
  const currentTime = Date.now();
  const timeUntilRefresh = tokenExpiryTime - currentTime - (5 * 60 * 1000); // 5 phút trước khi hết hạn
  
  // Nếu token đã hết hạn hoặc sắp hết hạn trong 5 phút tới, refresh ngay
  if (timeUntilRefresh <= 0) {
    store.dispatch(refreshAccessToken());
    return;
  }
  
  // Thiết lập timer để refresh trước khi token hết hạn
  const timerId = setTimeout(() => {
    store.dispatch(refreshAccessToken());
  }, timeUntilRefresh);
  
  // Lưu timer ID vào Redux store
  store.dispatch({ type: 'user/setRefreshTokenTimer', payload: timerId });
};

// Thiết lập timer ngay khi ứng dụng khởi động
setupRefreshTokenTimer();

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Bearer token to Authorization header if available
    const user = JSON.parse(localStorage.getItem("user") || "null"); // Add fallback to prevent errors
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user?.token}`;
    }
    // Add CORS headers if needed
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle response data
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi không phải 401 hoặc request đã được thử lại (để tránh vòng lặp vô hạn)
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Đánh dấu request này đã được thử refresh token
    originalRequest._retry = true;
    
    if (isRefreshing) {
      // Nếu đang trong quá trình refresh token, thêm request này vào queue
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    
    isRefreshing = true;
    
    try {
      // Thử refresh token
      await store.dispatch(refreshAccessToken()).unwrap();
      // Lấy token mới từ store
      const newState = store.getState();
      const newToken = newState.user.user?.token;
      
      // Cập nhật token cho request ban đầu và thực hiện lại
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      
      // Xử lý queue các request đang chờ
      processQueue(null, newToken);
      
      // Thiết lập timer cho refresh token tiếp theo
      setupRefreshTokenTimer();
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Nếu refresh thất bại, đăng xuất và từ chối tất cả request đang chờ
      processQueue(refreshError, null);
      store.dispatch(logOut());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const didAbort = (error) => axios.isCancel(error) && { aborted: true };

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error) => axios.isAxiosError(error);

const withAbort = (fn) => {
  const executor = async (...args) => {
    const originalConfig = args[args.length - 1];
    const { abort, ...config } = originalConfig;

    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn(url, body, config);
      } else {
        const [url] = args;
        return await fn(url, config);
      }
    } catch (error) {
      console.log("api error", error);

      if (didAbort(error)) {
        error.aborted = true;
      }

      throw error;
    }
  };

  return executor;
};

const withLogger = async (promise) =>
  promise.catch((error) => {
    /*
     *Always log errors in dev environment
     *if (process.env.NODE_ENV !== 'development') throw error
     */

    // Log error only if REACT_APP_DEBUG_API env is set to true
    if (!process.env.REACT_APP_DEBUG_API) throw error;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
    throw error;
  });

const http = (axios) => {
  return {
    get: (url, config = {}) => withLogger(withAbort(axios.get)(url, config)),
    delete: (url, config = {}) =>
      withLogger(withAbort(axios.delete)(url, config)),
    post: (url, body, config = {}) =>
      withLogger(withAbort(axios.post)(url, body, config)),
    patch: (url, body, config = {}) =>
      withLogger(withAbort(axios.patch)(url, body, config)),
    put: (url, body, config = {}) =>
      withLogger(withAbort(axios.put)(url, body, config)),
  };
};

export default http(axiosInstance);