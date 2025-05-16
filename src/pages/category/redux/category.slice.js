import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  categoryList: [],
  totalCount: 0,
  editingCategory: null,
  loading: false,
  currentRequestId: undefined,
};

export const getCategoryList = createAsyncThunk(
  "category/getCategoryList",
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post(
      "/auth/hangmuc/list",
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

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.post("/auth/hangmuc/add", body, {
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.put("/auth/hangmuc/update", body, {
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

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, thunkAPI) => {
    try {
      const { rc } = await http.delete("/auth/hangmuc", {
        data: { id: categoryId },
        signal: thunkAPI.signal,
      });
      if (!rc || rc.code !== 0) {
        message.error(rc?.desc || "Lỗi không xác định!");
        return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
      }
      return categoryId;
    } catch (error) {
      message.error("Xóa hạng mục thất bại!");
      return thunkAPI.rejectWithValue("Xóa hạng mục thất bại!");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    startEditingCategory: (state, action) => {
      const categoryId = action.payload;
      const foundCategory =
        state.categoryList.find((category) => category.id === categoryId) || null;
      state.editingCategory = foundCategory;
    },
    cancelEditingCategory: (state) => {
      state.editingCategory = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.categoryList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categoryList.find((category, index) => {
          if (category.id === action.payload.id) {
            state.categoryList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingCategory = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const categoryId = action.meta.arg;
        const deleteCategoryIndex = state.categoryList.findIndex(
          (category) => category.id === categoryId
        );
        if (deleteCategoryIndex !== -1) {
          state.categoryList.splice(deleteCategoryIndex, 1);
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

export const { startEditingCategory, cancelEditingCategory } =
  categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;
