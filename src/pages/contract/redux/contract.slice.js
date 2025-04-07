import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractList: [],
  editingContract: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeContractList = [
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

export const getContractList = createAsyncThunk(
  "contract/getContractList",
  async (searchTerm, thunkAPI) => {
    console.log("getContractList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeContractList;
    }

    const filteredContracts = fakeContractList.filter((contract) =>
      contract.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredContracts;
  }
);

export const addContract = createAsyncThunk(
  "contract/addContract",
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

export const updateContract = createAsyncThunk(
  "contract/updateContract",
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

export const deleteContract = createAsyncThunk(
  "contract/deleteContract",
  async (contractId, thunkAPI) => {
    const response = await http.delete(`contracts/${contractId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    startEditingContract: (state, action) => {
      const contractId = action.payload;
      const foundContract =
        state.contractList.find((contract) => contract.id === contractId) || null;
      state.editingContract = foundContract;
    },
    cancelEditingContract: (state) => {
      state.editingContract = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getContractList.fulfilled, (state, action) => {
        state.contractList = action.payload;
      })
      .addCase(addContract.fulfilled, (state, action) => {
        state.contractList.push(action.payload);
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.contractList.find((contract, index) => {
          if (contract.id === action.payload.id) {
            state.contractList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingContract = null;
      })

      .addCase(deleteContract.fulfilled, (state, action) => {
        const contractId = action.meta.arg;
        const deleteContractIndex = state.contractList.findIndex(
          (contract) => contract.id === contractId
        );
        if (deleteContractIndex !== -1) {
          state.contractList.splice(deleteContractIndex, 1);
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

export const { startEditingContract, cancelEditingContract } =
  contractSlice.actions;
const contractReducer = contractSlice.reducer;
export default contractReducer;
