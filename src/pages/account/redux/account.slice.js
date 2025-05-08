import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  accountList: [],
  totalCount: 0,
  editingAccount: null,
  loading: false,
  currentRequestId: undefined,
};

export const getAccountList = createAsyncThunk('account/getAccountList', async (filters, thunkAPI) => {
  const { rc, data, totalCount } = await http.post('/auth/user/list', { ...filters });

  if (rc?.code !== 0) {
    message.error(rc?.desc || 'Lỗi không xác định!');
    return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
  }

  return { data, totalCount };
});

export const addAccount = createAsyncThunk('account/addAccount', async (body, thunkAPI) => {
  try {
    const response = await http.post('accounts', body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const updateAccount = createAsyncThunk('account/updateAccount', async ({ accountId, body }, thunkAPI) => {
  try {
    const response = await http.put(`accounts/${accountId}`, body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  } catch (error) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const deleteAccount = createAsyncThunk('account/deleteAccount', async (accountId, thunkAPI) => {
  const response = await http.delete(`accounts/${accountId}`, {
    signal: thunkAPI.signal,
  });
  return response.data;
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    startEditingAccount: (state, action) => {
      const accountId = action.payload;
      const foundAccount = state.accountList.find((account) => account.id === accountId) || null;
      state.editingAccount = foundAccount;
    },
    cancelEditingAccount: (state) => {
      state.editingAccount = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAccountList.fulfilled, (state, action) => {
        state.accountList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accountList.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.accountList.find((account, index) => {
          if (account.id === action.payload.id) {
            state.accountList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingAccount = null;
      })

      .addCase(deleteAccount.fulfilled, (state, action) => {
        const accountId = action.meta.arg;
        const deleteAccountIndex = state.accountList.findIndex((account) => account.id === accountId);
        if (deleteAccountIndex !== -1) {
          state.accountList.splice(deleteAccountIndex, 1);
        }
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
      )
      .addDefaultCase((state, action) => {
        // console.log(`action type: ${action.type}`, current(state))
      });
  },
});

export const { startEditingAccount, cancelEditingAccount } = accountSlice.actions;
const accountReducer = accountSlice.reducer;
export default accountReducer;
