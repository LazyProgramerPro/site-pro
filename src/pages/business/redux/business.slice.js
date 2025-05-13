import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  businessList: [],
  totalCount: 0,
  editingBusiness: null,
  loading: false,
  currentRequestId: undefined,
};

export const getBusinessList = createAsyncThunk('business/getBusinessList', async (filters, thunkAPI) => {
  const { rc, data, totalCount } = await http.post('/auth/company/list', { ...filters });

  if (rc?.code !== 0) {
    message.error(rc?.desc || 'Lỗi không xác định!');
    return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
  }

  return { data, totalCount };
});

export const addBusiness = createAsyncThunk('business/addBusiness', async (body, thunkAPI) => {
  try {
    const { rc, item } = await http.post('/auth/company/add', body, {
      signal: thunkAPI.signal,
    });

    if (rc?.code !== 0) {
      message.error(rc?.desc || 'Lỗi không xác định!');
      return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
    }

    return item;
  } catch (error) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const updateBusiness = createAsyncThunk('business/updateBusiness', async (body, thunkAPI) => {
  try {
    const { rc, item } = await http.put('/auth/company/update', body, {
      signal: thunkAPI.signal,
    });

    if (rc?.code !== 0) {
      message.error(rc?.desc || 'Lỗi không xác định!');
      return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
    }

    return item;
  } catch (error) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const deleteBusiness = createAsyncThunk('business/deleteBusiness', async (businessId, thunkAPI) => {
  try {
    const { rc } = await http.delete(`/auth/company`, {
      data: { id: businessId },
      signal: thunkAPI.signal,
    });

    if (!rc || rc.code !== 0) {
      message.error(rc?.desc || 'Lỗi không xác định!');
      return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
    }

    return businessId;
  } catch (error) {
    message.error('Xóa doanh nghiệp thất bại!');
    return thunkAPI.rejectWithValue('Xóa doanh nghiệp thất bại!');
  }
});

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    startEditingBusiness: (state, action) => {
      const businessId = action.payload;
      const foundBusiness = state.businessList.find((business) => business.id === businessId) || null;
      state.editingBusiness = foundBusiness;
    },
    cancelEditingBusiness: (state) => {
      state.editingBusiness = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBusinessList.fulfilled, (state, action) => {
        state.businessList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addBusiness.fulfilled, (state, action) => {
        state.businessList.push(action.payload);
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.businessList.find((business, index) => {
          if (business.id === action.payload.id) {
            state.businessList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingBusiness = null;
      })

      .addCase(deleteBusiness.fulfilled, (state, action) => {
        const businessId = action.meta.arg;
        const deleteBusinessIndex = state.businessList.findIndex((business) => business.id === businessId);
        if (deleteBusinessIndex !== -1) {
          state.businessList.splice(deleteBusinessIndex, 1);
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

export const { startEditingBusiness, cancelEditingBusiness } = businessSlice.actions;
const businessReducer = businessSlice.reducer;
export default businessReducer;
