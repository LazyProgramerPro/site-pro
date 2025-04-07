import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  problemList: [],
  editingProblem: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeProblemList = [
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

export const getProblemList = createAsyncThunk(
  "problem/getProblemList",
  async (searchTerm, thunkAPI) => {
    console.log("getProblemList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeProblemList;
    }

    const filteredProblems = fakeProblemList.filter((problem) =>
      problem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredProblems;
  }
);

export const addProblem = createAsyncThunk(
  "problem/addProblem",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("problems", body, {
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

export const updateProblem = createAsyncThunk(
  "problem/updateProblem",
  async ({ problemId, body }, thunkAPI) => {
    try {
      const response = await http.put(`problems/${problemId}`, body, {
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

export const deleteProblem = createAsyncThunk(
  "problem/deleteProblem",
  async (problemId, thunkAPI) => {
    const response = await http.delete(`problems/${problemId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    startEditingProblem: (state, action) => {
      const problemId = action.payload;
      const foundProblem =
        state.problemList.find((problem) => problem.id === problemId) || null;
      state.editingProblem = foundProblem;
    },
    cancelEditingProblem: (state) => {
      state.editingProblem = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProblemList.fulfilled, (state, action) => {
        state.problemList = action.payload;
      })
      .addCase(addProblem.fulfilled, (state, action) => {
        state.problemList.push(action.payload);
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.problemList.find((problem, index) => {
          if (problem.id === action.payload.id) {
            state.problemList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingProblem = null;
      })

      .addCase(deleteProblem.fulfilled, (state, action) => {
        const problemId = action.meta.arg;
        const deleteProblemIndex = state.problemList.findIndex(
          (problem) => problem.id === problemId
        );
        if (deleteProblemIndex !== -1) {
          state.problemList.splice(deleteProblemIndex, 1);
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

export const { startEditingProblem, cancelEditingProblem } =
  problemSlice.actions;
const problemReducer = problemSlice.reducer;
export default problemReducer;
