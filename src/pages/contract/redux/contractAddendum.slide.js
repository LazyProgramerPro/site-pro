import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  contractAddendumList: [],
  totalCount: 0,
  editingContractAddendum: null,
  loading: false,
  currentRequestId: undefined,
};

export const getContractAddendumList = createAsyncThunk(
  'contractAddendum/getContractAddendumList',
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post(
      '/auth/phuluchopdong/list',
      { ...filters },
      { signal: thunkAPI.signal },
    );

    if (rc?.code == 32) {
      message.error(rc?.desc || 'Không tìm được dữ liệu tương ứng');
      return { data: [], totalCount: 0 };
    }

    if (rc?.code !== 0) {
      message.error(rc?.desc || 'Lỗi không xác định!');
      return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
    }

    return { data, totalCount };
  },
);

export const addContractAddendum = createAsyncThunk('contractAddendum/addContractAddendum', async (body, thunkAPI) => {
  try {
    const { rc, item } = await http.post('/auth/phuluchopdong/add', body, {
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

export const updateContractAddendum = createAsyncThunk(
  'contractAddendum/updateContractAddendum',
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.put('/auth/phuluchopdong/update', body, {
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
  },
);

export const deleteContractAddendum = createAsyncThunk(
  'contractAddendum/deleteContractAddendum',
  async (contractAddendumId, thunkAPI) => {
    try {
      const { rc } = await http.delete('/auth/phuluchopdong', {
        data: { id: contractAddendumId },
        signal: thunkAPI.signal,
      });
      if (!rc || rc.code !== 0) {
        message.error(rc?.desc || 'Lỗi không xác định!');
        return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
      }
      return contractAddendumId;
    } catch (error) {
      message.error('Xóa hợp đồng thất bại!');
      return thunkAPI.rejectWithValue('Xóa hợp đồng thất bại!');
    }
  },
);

export const importContractAddendumExcel = createAsyncThunk(
  'contractAddendum/importContractAddendumExcel',
  async (body, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', body.file);
      formData.append('description', body.description || 'Import Excel phụ lục hợp đồng');
      
      const { rc, item } = await http.post('/auth/phuluchopdong/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: thunkAPI.signal,
      });      if (rc?.code !== 0) {
        message.error(rc?.desc || 'Import Excel thất bại!');
        return thunkAPI.rejectWithValue(rc?.desc || 'Import Excel thất bại!');
      }

      // Message hiển thị ở component
      return item;
    } catch (error) {
      if (error.name === 'AxiosError' && error.response?.status === 422) {
        const errorMessage = error.response.data?.message || error.response.data?.desc || 'Dữ liệu không hợp lệ!';
        message.error(errorMessage);
        return thunkAPI.rejectWithValue(error.response.data);
      }
      
      if (error.name === 'AxiosError' && error.response?.status === 400) {
        const errorMessage = error.response.data?.message || error.response.data?.desc || 'File Excel không đúng định dạng!';
        message.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }
      
      const errorMessage = 'Import Excel thất bại! Vui lòng kiểm tra lại file và thử lại.';
      message.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

const contractAddendumSlice = createSlice({
  name: 'contractAddendum',
  initialState,
  reducers: {
    startEditingContractAddendum: (state, action) => {
      const contractAddendumId = action.payload;
      const foundContract = state.contractAddendumList.find((contract) => contract.id === contractAddendumId) || null;
      state.editingContractAddendum = foundContract;
    },
    cancelEditingContractAddendum: (state) => {
      state.editingContractAddendum = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getContractAddendumList.fulfilled, (state, action) => {
        state.contractAddendumList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addContractAddendum.fulfilled, (state, action) => {
        state.contractAddendumList.push(action.payload);
        state.totalCount = state.totalCount + 1;
      })
      .addCase(updateContractAddendum.fulfilled, (state, action) => {
        state.contractAddendumList.find((contract, index) => {
          if (contract.id === action.payload.id) {
            state.contractAddendumList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingContractAddendum = null;
      })
      .addCase(deleteContractAddendum.fulfilled, (state, action) => {
        const contractId = action.meta.arg;
        const deleteContractIndex = state.contractAddendumList.findIndex((contract) => contract.id === contractId);
        if (deleteContractIndex !== -1) {
          state.contractAddendumList.splice(deleteContractIndex, 1);
          state.totalCount = Math.max(0, state.totalCount - 1);
        }
      })      .addCase(importContractAddendumExcel.fulfilled, (state, action) => {
        // Có thể thêm logic để cập nhật danh sách sau khi import thành công
        // Ví dụ: reload danh sách hoặc thêm các item mới vào state
        if (action.payload && Array.isArray(action.payload)) {
          // Nếu API trả về danh sách các item đã import
          state.contractAddendumList = [...state.contractAddendumList, ...action.payload];
          state.totalCount = state.totalCount + action.payload.length;
        }
      })
      .addCase(importContractAddendumExcel.rejected, (state, action) => {
        // Xử lý khi import thất bại
        console.error('Import Excel failed:', action.payload);
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

export const { startEditingContractAddendum, cancelEditingContractAddendum } = contractAddendumSlice.actions;
const contractAddendumReducer = contractAddendumSlice.reducer;
export default contractAddendumReducer;
