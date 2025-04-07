import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
  editingCategory: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeCategoryList = [
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

export const getCategoryList = createAsyncThunk(
  "category/getCategoryList",
  async (searchTerm, thunkAPI) => {
    console.log("getCategoryList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeCategoryList;
    }

    const filteredCategories = fakeCategoryList.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredCategories;
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("categories", body, {
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ categoryId, body }, thunkAPI) => {
    try {
      const response = await http.put(`categories/${categoryId}`, body, {
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

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, thunkAPI) => {
    const response = await http.delete(`categories/${categoryId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
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
        state.categoryList = action.payload;
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
        // console.log(`action type: ${action.type}`, current(state))
      });
  },
});

export const { startEditingCategory, cancelEditingCategory } =
  categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;
