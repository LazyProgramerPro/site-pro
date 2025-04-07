import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractAddendumList: [],
  editingContractAddendum: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeContractAddendumList = [
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

  {
    id: "3",
    name: "Joe Black",
    description: "Sydney No. 1 Lake Park",
    price: 32,
    category: "Sydney No. 1 Lake Park",
    subCategory: "Sydney No. 1 Lake Park",
    quantity: 32,
  },

  {
    id: "4",
    name: "Joe Black",
    description: "Sydney No. 1 Lake Park",
    price: 32,
    category: "Sydney No. 1 Lake Park",
    subCategory: "Sydney No. 1 Lake Park",
    quantity: 32,
  },

  // ... (rest of the data remains unchanged)
];

export const getContractAddendumList = createAsyncThunk(
  "contractAddendum/getContractAddendumList",
  async (searchTerm, thunkAPI) => {
    console.log("getContractAddendumList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeContractAddendumList;
    }

    const filteredContracts = fakeContractAddendumList.filter((contract) =>
      contract.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredContracts;
  }
);

export const addContractAddendum = createAsyncThunk(
  "contractAddendum/addContractAddendum",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("contracts", body, {
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

export const updateContractAddendum = createAsyncThunk(
  "contractAddendum/updateContractAddendum",
  async ({ contractId, body }, thunkAPI) => {
    try {
      const response = await http.put(`contracts/${contractId}`, body, {
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

export const deleteContractAddendum = createAsyncThunk(
  "contractAddendum/deleteContractAddendum",
  async (contractId, thunkAPI) => {
    const response = await http.delete(`contracts/${contractId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const contractAddendumSlice = createSlice({
  name: "contractAddendum",
  initialState,
  reducers: {
    startEditingContractAddendum: (state, action) => {
      const contractId = action.payload;
      const foundContract =
        state.contractAddendumList.find((contract) => contract.id === contractId) || null;
      state.editingContractAddendum = foundContract;
    },
    cancelEditingContractAddendum: (state) => {
      state.editingContractAddendum = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getContractAddendumList.fulfilled, (state, action) => {
        state.contractAddendumList = action.payload;
      })
      .addCase(addContractAddendum.fulfilled, (state, action) => {
        state.contractAddendumList.push(action.payload);
      })
      .addCase(updateContractAddendum.fulfilled, (state, action) => {
        state.contractAddendumList.find((contract, index) => {
          if (contract.id === action.payload.id) {
            state.contractAddendumList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingContractAddendum = null;
      })

      .addCase(deleteContractAddendum.fulfilled, (state, action) => {
        const contractId = action.meta.arg;
        const deleteContractIndex = state.contractAddendumList.findIndex(
          (contract) => contract.id === contractId
        );
        if (deleteContractIndex !== -1) {
          state.contractAddendumList.splice(deleteContractIndex, 1);
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

export const { startEditingContractAddendum, cancelEditingContractAddendum } =
  contractAddendumSlice.actions;
const contractAddendumReducer = contractAddendumSlice.reducer;
export default contractAddendumReducer;
