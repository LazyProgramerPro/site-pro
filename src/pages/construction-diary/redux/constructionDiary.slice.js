import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  constructionDiaryList: [],
  editingConstructionDiary: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeConstructionDiaryList = [
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

export const getConstructionDiaryList = createAsyncThunk(
  "construction-diary/getConstructionDiaryList",
  async (searchTerm, thunkAPI) => {
    console.log("getConstructionDiaryList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeConstructionDiaryList;
    }

    const filteredConstructionDiaries = fakeConstructionDiaryList.filter((diary) =>
      diary.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredConstructionDiaries;
  }
);

export const addConstructionDiary = createAsyncThunk(
  "construction-diary/addConstructionDiary",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("construction-diaries", body, {
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

export const updateConstructionDiary = createAsyncThunk(
  "construction-diary/updateConstructionDiary",
  async ({ diaryId, body }, thunkAPI) => {
    try {
      const response = await http.put(`construction-diaries/${diaryId}`, body, {
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

export const deleteConstructionDiary = createAsyncThunk(
  "construction-diary/deleteConstructionDiary",
  async (diaryId, thunkAPI) => {
    const response = await http.delete(`construction-diaries/${diaryId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const constructionDiarySlice = createSlice({
  name: "construction-diary",
  initialState,
  reducers: {
    startEditingConstructionDiary: (state, action) => {
      const diaryId = action.payload;
      const foundDiary =
        state.constructionDiaryList.find((diary) => diary.id === diaryId) || null;
      state.editingConstructionDiary = foundDiary;
    },
    cancelEditingConstructionDiary: (state) => {
      state.editingConstructionDiary = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConstructionDiaryList.fulfilled, (state, action) => {
        state.constructionDiaryList = action.payload;
      })
      .addCase(addConstructionDiary.fulfilled, (state, action) => {
        state.constructionDiaryList.push(action.payload);
      })
      .addCase(updateConstructionDiary.fulfilled, (state, action) => {
        state.constructionDiaryList.find((diary, index) => {
          if (diary.id === action.payload.id) {
            state.constructionDiaryList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingConstructionDiary = null;
      })

      .addCase(deleteConstructionDiary.fulfilled, (state, action) => {
        const diaryId = action.meta.arg;
        const deleteDiaryIndex = state.constructionDiaryList.findIndex(
          (diary) => diary.id === diaryId
        );
        if (deleteDiaryIndex !== -1) {
          state.constructionDiaryList.splice(deleteDiaryIndex, 1);
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

export const { startEditingConstructionDiary, cancelEditingConstructionDiary } =
  constructionDiarySlice.actions;
const constructionDiaryReducer = constructionDiarySlice.reducer;
export default constructionDiaryReducer;
