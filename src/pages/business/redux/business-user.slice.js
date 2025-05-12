import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  userList: [],
  loading: false,
  currentRequestId: undefined,
};

export const getUserList = createAsyncThunk('business/getUserList', async (body, thunkAPI) => {
  try {
    const { rc, data, totalCount } = await http.post('/auth/user/list-by-doanh-nghiep-id', body);

    if (rc?.code !== 0) {
      message.error(rc?.desc || 'Unknown error!');
      // Return empty data array and totalCount 0 on error
      return { data: [], totalCount: 0 };
    }

    return { data, totalCount };
  } catch (error) {
    message.error('An error occurred while fetching the user list!');
    // Return empty data array and totalCount 0 on error
    return { data: [], totalCount: 0 };
  }
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
