import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  groupList: [],
  loading: false,
  currentRequestId: undefined,
};

export const getGroupList = createAsyncThunk('group/getGroupList', async (filters, thunkAPI) => {
  const { rc, rows, totalCount } = await http.get('auth/user/list-auth-group', {});

  console.log('rows:', rows);
  if (rc?.code !== 0) {
    message.error(rc?.desc || 'Lỗi không xác định!');
    return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
  }

  return { data: rows, totalCount };
});

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getGroupList.fulfilled, (state, action) => {
        state.groupList = action.payload.data;
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

const groupReducer = groupSlice.reducer;
export default groupReducer;
