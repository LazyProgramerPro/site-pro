import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  contractList: [],
  totalCount: 0,
  editingContract: null,
  loading: false,
  loadingDocuments: false,
  contractDocuments: [],
  contractImages: [],
  currentRequestId: undefined,
};

export const getContractList = createAsyncThunk('contract/getContractList', async (filters, thunkAPI) => {
  const { rc, data, totalCount } = await http.post('/auth/hopdong/list', { ...filters }, { signal: thunkAPI.signal });
  if (rc?.code !== 0) {
    message.error(rc?.desc || 'Lỗi không xác định!');
    return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
  }
  return { data, totalCount };
});

export const addContract = createAsyncThunk('contract/addContract', async (body, thunkAPI) => {
  try {
    const { rc, item } = await http.post('/auth/hopdong/add', body, {
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

export const updateContract = createAsyncThunk('contract/updateContract', async (body, thunkAPI) => {
  try {
    const { rc, item } = await http.put('/auth/hopdong/update', body, {
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

export const deleteContract = createAsyncThunk('contract/deleteContract', async (contractId, thunkAPI) => {
  try {
    const { rc } = await http.delete('/auth/hopdong', {
      data: { id: contractId },
      signal: thunkAPI.signal,
    });
    if (!rc || rc.code !== 0) {
      message.error(rc?.desc || 'Lỗi không xác định!');
      return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
    }
    return contractId;
  } catch (error) {
    message.error('Xóa hợp đồng thất bại!');
    return thunkAPI.rejectWithValue('Xóa hợp đồng thất bại!');
  }
});

/**
 * Lấy danh sách tài liệu và hình ảnh của hợp đồng
 */
export const getContractDocumentList = createAsyncThunk(
  'contract/getContractDocumentList',
  async (contractId, thunkAPI) => {
    try {
      console.log('Fetching documents for contractId:', contractId);
      const body = {
        owner_id: contractId,
        owner_type: 'HOP_DONG',
      };

      const response = await http.post('/auth/document/list', body);
      console.log('API raw response:', response);

      // Kiểm tra các cấu trúc response khác nhau
      if (response?.rc?.code !== 0) {
        console.error('API error:', response?.rc);
        message.error(response?.rc?.desc || 'Không thể tải danh sách tài liệu');
        return thunkAPI.rejectWithValue(response?.rc?.desc || 'Không thể tải danh sách tài liệu');
      }

      // Các trường hợp cấu trúc response
      if (response?.rootNode) {
        // Cấu trúc 1: { rootNode: { childDocs: [...] } }
        console.log('Using rootNode structure');
        return response.rootNode;
      } else if (response?.data && Array.isArray(response.data)) {
        // Cấu trúc 2: { data: [...] }
        console.log('Using data array structure');
        return { childDocs: response.data };
      } else if (response?.childDocs && Array.isArray(response.childDocs)) {
        // Cấu trúc 3: { childDocs: [...] }
        console.log('Using direct childDocs structure');
        return response;
      } else if (Array.isArray(response)) {
        // Cấu trúc 4: Mảng trực tiếp
        console.log('Using direct array structure');
        return { childDocs: response };
      } else {
        // Trường hợp không xác định, trả về cấu trúc rỗng
        console.warn('Unknown response structure:', response);
        return { childDocs: [] };
      }
    } catch (error) {
      console.error('Get contract documents error:', error);
      message.error('Không thể tải danh sách tài liệu hợp đồng');
      return thunkAPI.rejectWithValue('Không thể tải danh sách tài liệu hợp đồng');
    }
  },
);

/**
 * Upload tài liệu hợp đồng
 */
export const uploadContractDocumentThunk = createAsyncThunk(
  'contract/uploadContractDocument',
  async ({ file, contractId, parentId, name, description }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner_id', contractId);
      formData.append('owner_type', 'HOP_DONG');
      formData.append('parent_id', parentId || '');
      formData.append('name', name || file.name);
      formData.append('description', description || `Tài liệu hợp đồng - ${file.name}`);

      const { rc } = await http.post('/auth/document/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (rc?.code !== 0) {
        message.error(rc?.desc || 'Không thể upload tài liệu');
        return thunkAPI.rejectWithValue(rc?.desc || 'Không thể upload tài liệu');
      }

      // Sau khi upload thành công, lấy lại danh sách tài liệu
      thunkAPI.dispatch(getContractDocumentList(contractId));
      return rc.code;
    } catch (error) {
      console.error('Upload contract document error:', error);
      message.error('Không thể upload tài liệu hợp đồng');
      return thunkAPI.rejectWithValue('Không thể upload tài liệu hợp đồng');
    }
  },
);

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    startEditingContract: (state, action) => {
      const contractId = action.payload;
      const foundContract = state.contractList.find((contract) => contract.id === contractId) || null;
      state.editingContract = foundContract;
    },
    cancelEditingContract: (state) => {
      state.editingContract = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getContractList.fulfilled, (state, action) => {
        state.contractList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addContract.fulfilled, (state, action) => {
        state.contractList.push(action.payload);
        state.totalCount = state.totalCount + 1;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.contractList.find((contract, index) => {
          if (contract.id === action.payload.id) {
            state.contractList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingContract = null;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        const contractId = action.meta.arg;
        const deleteContractIndex = state.contractList.findIndex((contract) => contract.id === contractId);
        if (deleteContractIndex !== -1) {
          state.contractList.splice(deleteContractIndex, 1);
          state.totalCount = Math.max(0, state.totalCount - 1);
        }
      })

      .addCase(getContractDocumentList.pending, (state) => {
        state.loadingDocuments = true;
      })
      .addCase(getContractDocumentList.fulfilled, (state, action) => {
        state.loadingDocuments = false;

        // Khởi tạo arrays rỗng cho ảnh và tài liệu
        const images = [];
        const documents = [];

        // Log dữ liệu nhận được để debug
        console.log('API Response rootNode:', action.payload);
        // Xử lý dữ liệu từ API
        try {
          // Kiểm tra cấu trúc dữ liệu và xử lý đúng định dạng
          let childDocs = [];

          // Log chi tiết cấu trúc dữ liệu
          console.log('Raw API response structure:', JSON.stringify(action.payload, null, 2).substring(0, 500) + '...');

          if (action.payload?.childDocs && Array.isArray(action.payload.childDocs)) {
            console.log('Using childDocs from rootNode');
            childDocs = action.payload.childDocs;
          } else if (action.payload && Array.isArray(action.payload)) {
            console.log('Using direct array response');
            childDocs = action.payload;
          } else if (action.payload?.data && Array.isArray(action.payload.data)) {
            // Trường hợp API trả về dạng { data: [...] }
            console.log('Using data array from response');
            childDocs = action.payload.data;
          }

          console.log('Processing childDocs length:', action.payload);

          // Xử lý từng item trong danh sách tài liệu
          childDocs.forEach((doc) => {
            if (!doc) {
              console.log('Invalid doc item: null or undefined');
              return; // Bỏ qua nếu item không hợp lệ
            }

            // Kiểm tra cấu trúc tài liệu - có thể là { doc: {...} } hoặc trực tiếp là tài liệu
            const docData = doc.doc || doc;

            if (!docData || !docData.name) {
              console.log('Invalid document data:', docData);
              return; // Bỏ qua nếu không có thông tin cần thiết
            }
            // Lấy extension từ tên file
            const fileName = docData.name || '';
            const extension = docData?.extension?.toLowerCase() || fileName.split('.').pop().toLowerCase();

            console.log('Processing document:', extension);

            // Tạo đối tượng tài liệu chuẩn
            const item = {
              id: docData.id || doc.id || `temp-${Date.now()}`,
              name: docData.name || 'Không có tên',
              url: docData.url || doc.url || '',
              type: extension || 'unknown',
              date: docData.created_at || doc.created_at || new Date().toISOString(),
              size: docData.file_size ? (docData.file_size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A',
            };
            // Phân loại tài liệu hoặc hình ảnh
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);

            console.log('Processing item:', item);

            if (isImage) {
              images.push(item);
            } else {
              documents.push(item);
            }
          });
        } catch (error) {
          console.error('Error processing contract documents:', error);
        }

        console.log('Processed images:', images.length, 'documents:', documents.length);

        // Cập nhật state
        state.contractImages = images;
        state.contractDocuments = documents; // Chỉ lưu tài liệu, không bao gồm ảnh
      })
      .addCase(getContractDocumentList.rejected, (state) => {
        state.loadingDocuments = false;
        state.contractImages = [];
        state.contractDocuments = [];
      })

      .addCase(uploadContractDocumentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadContractDocumentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadContractDocumentThunk.rejected, (state) => {
        state.loading = false;
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

export const { startEditingContract, cancelEditingContract } = contractSlice.actions;
const contractReducer = contractSlice.reducer;
export default contractReducer;
