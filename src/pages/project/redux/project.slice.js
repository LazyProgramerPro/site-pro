import http from '@/utils/http';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectList: [],
  totalCount: 0,
  editingProject: null,
  loading: false,
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
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.meta.arg;
        const deleteProjectIndex = state.projectList.findIndex((project) => project.id === projectId);
        if (deleteProjectIndex !== -1) {
          state.projectList.splice(deleteProjectIndex, 1);
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

export const { startEditingProject, cancelEditingProject } = projectSlice.actions;
const projectReducer = projectSlice.reducer;
export default projectReducer;
