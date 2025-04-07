import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  constructionList: [],
  editingConstruction: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeConstructionList = [
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

export const getConstructionList = createAsyncThunk(
  "construction/getConstructionList",
  async (searchTerm, thunkAPI) => {
    console.log("getConstructionList with searchTerm:", searchTerm);

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
