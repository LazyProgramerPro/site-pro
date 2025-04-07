import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectList: [],
  editingProject: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeProjectList = [
  // Keep your example data
  {
    id: "1",
    name: "John Brown",
    description: "New York No. 1 Lake Park",
    price: 32,
    category: "New York No. 1 Lake Park",
    subCategory: "New York No. 1 Lake Park",
    quantity: 32,
  },
  {
    id: "2",
    name: "Jim Green",
    description: "London No. 1 Lake Park",
    price: 42,
    category: "London No. 1 Lake Park",
    subCategory: "London No. 1 Lake Park",
    quantity: 42,
  },
  // ... (rest of the data remains unchanged)
];

export const getProjectList = createAsyncThunk(
  "project/getProjectList",
  async (searchTerm, thunkAPI) => {
    console.log("getProjectList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeProjectList;
    }

    const filteredProjects = fakeProjectList.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredProjects;
  }
);

export const addProject = createAsyncThunk(
  "project/addProject",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("projects", body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error) {
      if (error.name === "AxiosError" && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ projectId, body }, thunkAPI) => {
    try {
      const response = await http.put(`projects/${projectId}`, body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error) {
      if (error.name === "AxiosError" && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId, thunkAPI) => {
    const response = await http.delete(`projects/${projectId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    startEditingProject: (state, action) => {
      const projectId = action.payload;
      const foundProject =
        state.projectList.find((project) => project.id === projectId) || null;
      state.editingProject = foundProject;
    },
    cancelEditingProject: (state) => {
      state.editingProject = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProjectList.fulfilled, (state, action) => {
        state.projectList = action.payload;
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
        const deleteProjectIndex = state.projectList.findIndex(
          (project) => project.id === projectId
        );
        if (deleteProjectIndex !== -1) {
          state.projectList.splice(deleteProjectIndex, 1);
        }
      })

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") ||
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addDefaultCase((state, action) => {
        // console.log(`action type: ${action.type}`, current(state))
      });
  },
});

export const { startEditingProject, cancelEditingProject } =
  projectSlice.actions;
const projectReducer = projectSlice.reducer;
export default projectReducer;
