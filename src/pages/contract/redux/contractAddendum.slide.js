import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  contractAddendumList: [],
  totalCount: 0,
  editingContractAddendum: null,
  loading: false,
  loadingDocuments: false,
  contractAddendumDocuments: [],
  contractAddendumImages: [],
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

/**
 * Lấy danh sách tài liệu và hình ảnh của phụ lục hợp đồng
 */
export const getContractAddendumDocumentList = createAsyncThunk(
  'contractAddendum/getContractAddendumDocumentList',
  async (contractAddendumId, thunkAPI) => {
    try {
      console.log('Fetching documents for contractAddendumId:', contractAddendumId);
      const body = {
        owner_id: contractAddendumId,
        owner_type: 'PHU_LUC_HOP_DONG',
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
      console.error('Get contract addendum documents error:', error);
      message.error('Không thể tải danh sách tài liệu phụ lục hợp đồng');
      return thunkAPI.rejectWithValue('Không thể tải danh sách tài liệu phụ lục hợp đồng');
    }
  },
);

/**
 * Upload tài liệu phụ lục hợp đồng
 */
export const uploadContractAddendumDocumentThunk = createAsyncThunk(
  'contractAddendum/uploadContractAddendumDocument',
  async ({ file, contractAddendumId, parentId, name, description }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner_id', contractAddendumId);
      formData.append('owner_type', 'PHU_LUC_HOP_DONG');
      formData.append('parent_id', parentId || '');
      formData.append('name', name || file.name);
      formData.append('description', description || `Tài liệu phụ lục hợp đồng - ${file.name}`);

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
      thunkAPI.dispatch(getContractAddendumDocumentList(contractAddendumId));
      return rc.code;
    } catch (error) {
      console.error('Upload contract addendum document error:', error);
      message.error('Không thể upload tài liệu phụ lục hợp đồng');
      return thunkAPI.rejectWithValue('Không thể upload tài liệu phụ lục hợp đồng');
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
      });
      if (rc?.code !== 0) {
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
        const errorMessage =
          error.response.data?.message || error.response.data?.desc || 'File Excel không đúng định dạng!';
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
      })
      .addCase(importContractAddendumExcel.fulfilled, (state, action) => {
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

      .addCase(getContractAddendumDocumentList.pending, (state) => {
        state.loadingDocuments = true;
      })
      .addCase(getContractAddendumDocumentList.fulfilled, (state, action) => {
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
          console.error('Error processing contract addendum documents:', error);
        }

        console.log('Processed images:', images.length, 'documents:', documents.length);

        // Cập nhật state
        state.contractAddendumImages = images;
        state.contractAddendumDocuments = documents; // Chỉ lưu tài liệu, không bao gồm ảnh
      })
      .addCase(getContractAddendumDocumentList.rejected, (state) => {
        state.loadingDocuments = false;
        state.contractAddendumImages = [];
        state.contractAddendumDocuments = [];
      })

      .addCase(uploadContractAddendumDocumentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadContractAddendumDocumentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadContractAddendumDocumentThunk.rejected, (state) => {
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

export const { startEditingContractAddendum, cancelEditingContractAddendum } = contractAddendumSlice.actions;
const contractAddendumReducer = contractAddendumSlice.reducer;
export default contractAddendumReducer;
