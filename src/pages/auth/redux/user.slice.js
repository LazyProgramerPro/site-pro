import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/utils/http";

// Thời gian tính bằng milliseconds trước khi token hết hạn để thực hiện refresh
// Mặc định: 5 phút = 5 * 60 * 1000 ms
const REFRESH_TOKEN_BEFORE_EXPIRY = 5 * 60 * 1000;

// Giải mã JWT token để lấy thông tin expiry time
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// Tính toán thời gian hết hạn của token dựa vào JWT payload
const getTokenExpiry = (token) => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return null;
  
  // JWT exp là thời gian tính bằng giây
  return decoded.exp * 1000; // Chuyển sang milliseconds
};

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  tokenExpiryTime: null,
  refreshTokenTimerId: null,
  isRefreshing: false,
};

// Thunk xử lý refresh token
export const refreshAccessToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState }) => {
    const { user } = getState().user;
    if (!user || !user.token) {
      throw new Error("Không có token để làm mới");
    }

    try {
      // Gọi API refresh token - điều chỉnh endpoint theo API thực tế
      const { auth, info } = await http.post("/refresh-token", {
        // Có thể cần truyền refresh_token nếu backend yêu cầu
        token: user.token,
      });

      const { access_token } = auth;
      const { username, is_active } = info;

      // Trả về payload mới cho user state
      return {
        token: access_token,
        username,
        is_active,
      };
    } catch (error) {
      console.error("Lỗi khi refresh token:", error);
      // Nếu refresh token thất bại, đăng xuất người dùng
      localStorage.removeItem("user");
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loggedInUser: (state, action) => {
      state.user = action.payload;
      
      // Lưu token vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      
      // Tính toán thời gian hết hạn của token
      if (action.payload?.token) {
        state.tokenExpiryTime = getTokenExpiry(action.payload.token);
      }
    },

    logOut: (state) => {
      state.user = null;
      state.tokenExpiryTime = null;
      
      // Xóa timer nếu có
      if (state.refreshTokenTimerId) {
        clearTimeout(state.refreshTokenTimerId);
        state.refreshTokenTimerId = null;
      }
      
      // Xóa thông tin user khỏi localStorage
      localStorage.removeItem("user");
    },
    
    // Thiết lập timer cho việc refresh token
    setRefreshTokenTimer: (state, action) => {
      state.refreshTokenTimerId = action.payload;
    },
  },
  
  extraReducers(builder) {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isRefreshing = false;
        
        // Cập nhật localStorage với token mới
        localStorage.setItem("user", JSON.stringify(action.payload));
        
        // Cập nhật thời gian hết hạn mới
        if (action.payload?.token) {
          state.tokenExpiryTime = getTokenExpiry(action.payload.token);
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Nếu refresh token thất bại, đăng xuất người dùng
        state.user = null;
        state.tokenExpiryTime = null;
        state.isRefreshing = false;
        state.refreshTokenTimerId = null;
        
        localStorage.removeItem("user");
      });
  },
});

export const { loggedInUser, logOut, setRefreshTokenTimer } = userSlice.actions;
const userReducer = userSlice.reducer;

export default userReducer;
