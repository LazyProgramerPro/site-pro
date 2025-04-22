import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
  editingCategory: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeCategoryList = [
  {
    id: '1',
    categoryCode: 'HM-001',
    categoryName: 'Phần móng',
    constructionName: 'Chung cư Sky Garden',
  },
  {
    id: '2',
    categoryCode: 'HM-002',
    categoryName: 'Phần kết cấu',
    constructionName: 'Chung cư Sky Garden',
  },
  {
    id: '3',
    categoryCode: 'HM-003',
    categoryName: 'Hệ thống điện',
    constructionName: 'Trung tâm Thương mại Sunshine',
  },
  {
    id: '4',
    categoryCode: 'HM-004',
    categoryName: 'Hệ thống nước',
    constructionName: 'Trung tâm Thương mại Sunshine',
  },
  {
    id: '5',
    categoryCode: 'HM-005',
    categoryName: 'Phần hoàn thiện',
    constructionName: 'Khu nhà ở Thủ Đức',
  },
  {
    id: '6',
    categoryCode: 'HM-006',
    categoryName: 'Công tác xây gạch',
    constructionName: 'Khu nhà ở Thủ Đức',
  },
  {
    id: '7',
    categoryCode: 'HM-007',
    categoryName: 'Công tác lắp kính',
    constructionName: 'Bệnh viện Đa khoa Quốc tế',
  },
  {
    id: '8',
    categoryCode: 'HM-008',
    categoryName: 'Hệ thống PCCC',
    constructionName: 'Bệnh viện Đa khoa Quốc tế',
  },
  {
    id: '9',
    categoryCode: 'HM-009',
    categoryName: 'Hệ thống điều hòa',
    constructionName: 'Trường Đại học Công nghệ',
  },
  {
    id: '10',
    categoryCode: 'HM-010',
    categoryName: 'Công tác sơn',
    constructionName: 'Trường Đại học Công nghệ',
  },
  {
    id: '11',
    categoryCode: 'HM-011',
    categoryName: 'Công tác lát sàn',
    constructionName: 'Cầu Vượt Sông Hồng',
  },
  {
    id: '12',
    categoryCode: 'HM-012',
    categoryName: 'Hệ thống cấp thoát nước',
    constructionName: 'Nhà máy Xử lý Nước thải',
  },
  {
    id: '13',
    categoryCode: 'HM-013',
    categoryName: 'Hệ thống thông tin liên lạc',
    constructionName: 'Khu Công nghệ cao Hòa Lạc',
  },
  {
    id: '14',
    categoryCode: 'HM-014',
    categoryName: 'Công tác mặt đường',
    constructionName: 'Đường sắt Đô thị Nhổn - Ga Hà Nội',
  },
  {
    id: '15',
    categoryCode: 'HM-015',
    categoryName: 'Trần thạch cao',
    constructionName: 'Khu Đô thị Thủ Thiêm',
  },
];


export const getCategoryList = createAsyncThunk(
  "category/getCategoryList",
  async (searchTerm, thunkAPI) => {
    console.log("getCategoryList with searchTerm:", searchTerm);
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
