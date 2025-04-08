import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectList: [],
  editingProject: null,
  loading: false,
  currentRequestId: undefined,
};

// Sample project data for testing
const fakeProjectList = [
  {
    id: 1,
    projectCode: "PRJ001",
    projectName: "Khu đô thị Phú Mỹ Hưng",
    description: "Xây dựng khu đô thị phức hợp cao cấp",
    startDate: "15/01/2023",
    endDate: "30/06/2025",
    contractor: "Công ty TNHH Xây dựng ABC",
    supervisor: "Công ty Giám sát XYZ",
    designer: "Tư vấn Thiết kế 123",
  },
  {
    id: 2,
    projectCode: "PRJ002",
    projectName: "Cầu Nhật Tân",
    description: "Dự án xây dựng cầu vượt sông",
    startDate: "20/05/2022",
    endDate: "15/12/2024",
    contractor: "Tập đoàn Xây dựng Hòa Bình",
    supervisor: "Công ty CP Tư vấn Delta",
    designer: "JICA Consulting",
  },
  {
    id: 3,
    projectCode: "PRJ003",
    projectName: "Tòa nhà Landmark 81",
    description: "Xây dựng tòa nhà cao nhất Việt Nam",
    startDate: "10/08/2023",
    endDate: "25/03/2026",
    contractor: "Coteccons",
    supervisor: "APAVE",
    designer: "Atkins Global",
  },
  {
    id: 4,
    projectCode: "PRJ004",
    projectName: "Đường cao tốc Bắc Nam",
    description: "Đoạn Ninh Bình - Thanh Hóa",
    startDate: "05/11/2022",
    endDate: "30/10/2025",
    contractor: "Tổng công ty CIENC1",
    supervisor: "TEDIS",
    designer: "TEDI",
  },
  {
    id: 5,
    projectCode: "PRJ005",
    projectName: "Khu công nghiệp Vân Trung",
    description: "Mở rộng khu công nghiệp giai đoạn 2",
    startDate: "15/03/2023",
    endDate: "20/09/2024",
    contractor: "VISSAI Group",
    supervisor: "CONINCO",
    designer: "VINACONEX E&C",
  },
  {
    id: 6,
    projectCode: "PRJ006",
    projectName: "Nhà máy nhiệt điện Vũng Áng",
    description: "Dự án năng lượng trọng điểm quốc gia",
    startDate: "01/09/2022",
    endDate: "31/08/2026",
    contractor: "Power Construction Corp",
    supervisor: "PECC2",
    designer: "PVC-IC",
  },
  {
    id: 7,
    projectCode: "PRJ007",
    projectName: "Metro Bến Thành - Suối Tiên",
    description: "Tuyến metro số 1 TP.HCM",
    startDate: "10/12/2021",
    endDate: "25/11/2025",
    contractor: "Sumitomo - Cienco 6",
    supervisor: "NJPT",
    designer: "Nippon Koei",
  },
  {
    id: 8,
    projectCode: "PRJ008",
    projectName: "Đập Thủy điện Sơn La",
    description: "Nâng cấp và mở rộng công suất",
    startDate: "18/06/2023",
    endDate: "30/04/2026",
    contractor: "Song Da Corporation",
    supervisor: "Vietnam Engineering Consultant",
    designer: "Power Engineering Consulting",
  }
];

// You can use this data in your Redux store or for testing purposes

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
