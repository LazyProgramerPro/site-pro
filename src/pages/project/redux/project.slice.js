import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  projectList: [],
  totalCount: 0,
  editingProject: null,
  loading: false,
  loadingDocuments: false,
  projectDocuments: [],
  projectImages: [],
  currentRequestId: undefined,
};

export const getProjectList = createAsyncThunk('project/getProjectList', async (filters, thunkAPI) => {
  const { rc, data, totalCount } = await http.post('/auth/duan/list', { ...filters });

  if (rc?.code !== 0) {
    message.error(rc?.desc || 'Lỗi không xác định!');
    return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
  }

  return { data, totalCount };
});

export const addProject = createAsyncThunk('project/addProject', async (body, thunkAPI) => {
  try {
    const { item, rc } = await http.post('/auth/duan/add', body, {
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

export const updateProject = createAsyncThunk('project/updateProject', async (body, thunkAPI) => {
  try {
    const { rc, item } = await http.put('/auth/duan/update', body, {
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

export const deleteProject = createAsyncThunk('project/deleteProject', async (projectId, thunkAPI) => {
    const response = await http.delete(`/auth/duan`, {
      data: {
        id: projectId,
      },
      signal: thunkAPI.signal,
    });
  return response.data;
});

/**
 * Lấy danh sách tài liệu và hình ảnh của dự án
 */
export const getProjectDocumentList = createAsyncThunk(
  'project/getProjectDocumentList',
  async (projectId, thunkAPI) => {
    try {
      console.log('Fetching documents for projectId:', projectId);
      const body = {
        owner_id: projectId,
        owner_type: 'DU_AN',
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
      console.error('Get project documents error:', error);
      message.error('Không thể tải danh sách tài liệu dự án');
      return thunkAPI.rejectWithValue('Không thể tải danh sách tài liệu dự án');
    }
  }
);

/**
 * Upload tài liệu dự án
 */
export const uploadProjectDocumentThunk = createAsyncThunk(
  'project/uploadProjectDocument',
  async ({ file, projectId, parentId, name, description }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner_id', projectId);
      formData.append('owner_type', 'DU_AN');
      formData.append('parent_id', parentId || '');
      formData.append('name', name || file.name);
      formData.append('description', description || `Tài liệu dự án - ${file.name}`);

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
      thunkAPI.dispatch(getProjectDocumentList(projectId));
      return rc.code;
    } catch (error) {
      console.error('Upload project document error:', error);
      message.error('Không thể upload tài liệu dự án');
      return thunkAPI.rejectWithValue('Không thể upload tài liệu dự án');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    startEditingProject: (state, action) => {
      const projectId = action.payload;
      const foundProject = state.projectList.find((project) => project.id === projectId) || null;
      state.editingProject = foundProject;
    },
    cancelEditingProject: (state) => {
      state.editingProject = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProjectList.fulfilled, (state, action) => {
        state.projectList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projectList.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.projectList.find((project, index) => {
          if (project.id === action.payload.id) {
            state.projectList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingProject = null;
      })      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.meta.arg;
        const deleteProjectIndex = state.projectList.findIndex((project) => project.id === projectId);
        if (deleteProjectIndex !== -1) {
          state.projectList.splice(deleteProjectIndex, 1);
        }
      })
      
      .addCase(getProjectDocumentList.pending, (state) => {
        state.loadingDocuments = true;
      })      .addCase(getProjectDocumentList.fulfilled, (state, action) => {
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
          
          console.log('Processing childDocs length:', childDocs.length);
          
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
            const extension = fileName.toLowerCase().split('.').pop();
            
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
            
            if (isImage) {
              images.push(item);
            } else {
              documents.push(item);
            }
          });
        } catch (error) {
          console.error('Error processing project documents:', error);
        }
        
        console.log('Processed images:', images.length, 'documents:', documents.length);
        
        // Cập nhật state
        state.projectImages = images;
        state.projectDocuments = documents; // Chỉ lưu tài liệu, không bao gồm ảnh
      })
      .addCase(getProjectDocumentList.rejected, (state) => {
        state.loadingDocuments = false;
        state.projectImages = [];
        state.projectDocuments = [];
      })
      
      .addCase(uploadProjectDocumentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProjectDocumentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadProjectDocumentThunk.rejected, (state) => {
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

export const { startEditingProject, cancelEditingProject } = projectSlice.actions;
const projectReducer = projectSlice.reducer;
export default projectReducer;
