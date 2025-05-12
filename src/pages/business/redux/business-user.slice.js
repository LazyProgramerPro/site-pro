import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  userList: [],
  loading: false,
  currentRequestId: undefined,
};

export const getUserList = createAsyncThunk('business/getUserList', async (filters, thunkAPI) => {
  const { rc, data, totalCount } = await http.post('/auth/user/list', { ...filters });

  if (rc?.code !== 0) {
    message.error(rc?.desc || 'Lỗi không xác định!');
    return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
  }

  return { data, totalCount };
});

const userSlice = createSlice({
  name: 'businessUser',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        },
      );
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
