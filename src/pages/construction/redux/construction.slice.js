import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  constructionList: [],
  totalCount: 0,
  editingConstruction: null,
  loading: false,
  currentRequestId: undefined,
};

export const getConstructionList = createAsyncThunk(
  "construction/getConstructionList",
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post(
      "/auth/congtrinh/list",
      { ...filters },
      { signal: thunkAPI.signal }
    );
    if (rc?.code !== 0) {
      message.error(rc?.desc || "Lỗi không xác định!");
      return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
    }
    return { data, totalCount };
  }
);

export const addConstruction = createAsyncThunk(
  "construction/addConstruction",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.post("/auth/congtrinh/add", body, {
        signal: thunkAPI.signal,
      });
      if (rc?.code !== 0) {
        message.error(rc?.desc || "Lỗi không xác định!");
        return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
      }
      return item;
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
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.put("/auth/congtrinh/update", body, {
        signal: thunkAPI.signal,
      });
      if (rc?.code !== 0) {
        message.error(rc?.desc || "Lỗi không xác định!");
        return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
      }
      return item;
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
    try {
      const { rc } = await http.delete("/auth/congtrinh", {
        data: { id: constructionId },
        signal: thunkAPI.signal,
      });
      if (!rc || rc.code !== 0) {
        message.error(rc?.desc || "Lỗi không xác định!");
        return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
      }
      return constructionId;
    } catch (error) {
      message.error("Xóa công trình thất bại!");
      return thunkAPI.rejectWithValue("Xóa công trình thất bại!");
    }
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
        state.constructionList = action.payload.data;
        state.totalCount = action.payload.totalCount;
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
        // ...existing code...
      });
  },
});

export const { startEditingConstruction, cancelEditingConstruction } =
  constructionSlice.actions;
const constructionReducer = constructionSlice.reducer;
export default constructionReducer;
