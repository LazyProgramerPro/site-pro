import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state từ localStorage hoặc giá trị mặc định
const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getUserData(),
  isAuthenticated: !!getUserData()?.token,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loggedInUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload?.token;
    },

    loginSuccess: (state, action) => {
      // Cập nhật trạng thái từ userData trực tiếp
      state.user = action.payload;
      state.isAuthenticated = !!action.payload?.token;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateToken: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          token: action.payload.token || state.user.token,
          refresh_token: action.payload.refresh_token || state.user.refresh_token,
          expires_in: action.payload.expires_in || state.user.expires_in,
          refresh_expires_in: action.payload.refresh_expires_in || state.user.refresh_expires_in,
          token_created_at: new Date().toISOString(),
          // Chỉ cập nhật thời điểm tạo refresh token nếu có refresh token mới
          refresh_token_created_at: action.payload.refresh_token
            ? new Date().toISOString()
            : state.user.refresh_token_created_at,
        };
      }
      state.isAuthenticated = !!state.user?.token;
    },
  },
  extraReducers(builder) {
    builder.addDefaultCase((state, action) => {
      // console.log(`action type: ${action.type}`, current(state))
    });
  },
});

export const { loggedInUser, loginSuccess, logout, updateToken } = userSlice.actions;
const userReducer = userSlice.reducer;

export default userReducer;
