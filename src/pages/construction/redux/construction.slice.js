import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  constructionList: [],
  editingConstruction: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeConstructionList = [
  {
    id: '1',
    code: 'CT-2023-001',
    name: 'Chung cư Sky Garden',
    projectName: 'Dự án Phát triển Đô thị Xanh',
  },
  {
    id: '2',
    code: 'CT-2023-002',
    name: 'Cầu Vượt Sông Hồng',
    projectName: 'Dự án Giao thông Đô thị',
  },
  {
    id: '3',
    code: 'CT-2023-003',
    name: 'Trung tâm Thương mại Sunshine',
    projectName: 'Dự án Phát triển Khu đô thị mới',
  },
  {
    id: '4',
    code: 'CT-2023-004',
    name: 'Khu nhà ở Thủ Đức',
    projectName: 'Dự án Nhà ở Xã hội',
  },
  {
    id: '5',
    code: 'CT-2023-005',
    name: 'Trường Đại học Công nghệ',
    projectName: 'Dự án Phát triển Giáo dục',
  },
  {
    id: '6',
    code: 'CT-2023-006',
    name: 'Bệnh viện Đa khoa Quốc tế',
    projectName: 'Dự án Y tế Cộng đồng',
  },
  {
    id: '7',
    code: 'CT-2023-007',
    name: 'Hầm chui Nguyễn Trãi',
    projectName: 'Dự án Giao thông Đô thị',
  },
  {
    id: '8',
    code: 'CT-2023-008',
    name: 'Nhà máy Xử lý Nước thải',
    projectName: 'Dự án Môi trường Xanh',
  },
  {
    id: '9',
    code: 'CT-2023-009',
    name: 'Khu Công nghệ cao Hòa Lạc',
    projectName: 'Dự án Phát triển Công nghệ',
  },
  {
    id: '10',
    code: 'CT-2023-010',
    name: 'Cảng biển Cái Mép',
    projectName: 'Dự án Phát triển Hạ tầng',
  },
  {
    id: '11',
    code: 'CT-2023-011',
    name: 'Khu Đô thị Thủ Thiêm',
    projectName: 'Dự án Phát triển Đô thị',
  },
  {
    id: '12',
    code: 'CT-2023-012',
    name: 'Đường sắt Đô thị Nhổn - Ga Hà Nội',
    projectName: 'Dự án Giao thông Công cộng',
  }
];

export const getConstructionList = createAsyncThunk(
  "construction/getConstructionList",
  async (searchTerm, thunkAPI) => {
    console.log("getConstructionList with searchTerm:", searchTerm);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (!searchTerm) {
      return fakeConstructionList;
    }

    const filteredConstructions = fakeConstructionList.filter((construction) =>
      construction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredConstructions;
  }
);

export const addConstruction = createAsyncThunk(
  "construction/addConstruction",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("constructions", body, {
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

export const updateConstruction = createAsyncThunk(
  "construction/updateConstruction",
  async ({ constructionId, body }, thunkAPI) => {
    try {
      const response = await http.put(`constructions/${constructionId}`, body, {
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

export const deleteConstruction = createAsyncThunk(
  "construction/deleteConstruction",
  async (constructionId, thunkAPI) => {
    const response = await http.delete(`constructions/${constructionId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const constructionSlice = createSlice({
  name: "construction",
  initialState,
  reducers: {
    startEditingConstruction: (state, action) => {
      const constructionId = action.payload;
      const foundConstruction =
        state.constructionList.find(
          (construction) => construction.id === constructionId
        ) || null;
      state.editingConstruction = foundConstruction;
    },
    cancelEditingConstruction: (state) => {
      state.editingConstruction = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConstructionList.fulfilled, (state, action) => {
        state.constructionList = action.payload;
      })
      .addCase(addConstruction.fulfilled, (state, action) => {
        state.constructionList.push(action.payload);
      })
      .addCase(updateConstruction.fulfilled, (state, action) => {
        state.constructionList.find((construction, index) => {
          if (construction.id === action.payload.id) {
            state.constructionList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingConstruction = null;
      })
      .addCase(deleteConstruction.fulfilled, (state, action) => {
        const constructionId = action.meta.arg;
        const deleteConstructionIndex = state.constructionList.findIndex(
          (construction) => construction.id === constructionId
        );
        if (deleteConstructionIndex !== -1) {
          state.constructionList.splice(deleteConstructionIndex, 1);
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

export const { startEditingConstruction, cancelEditingConstruction } =
  constructionSlice.actions;
const constructionReducer = constructionSlice.reducer;
export default constructionReducer;
