import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  contractList: [],
  totalCount: 0,
  editingContract: null,
  loading: false,
  currentRequestId: undefined,
};

export const getContractList = createAsyncThunk(
  "contract/getContractList",
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post(
      "/auth/hopdong/list",
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

export const addContract = createAsyncThunk(
  "contract/addContract",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.post("/auth/hopdong/add", body, {
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

export const updateContract = createAsyncThunk(
  "contract/updateContract",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.put("/auth/hopdong/update", body, {
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

export const deleteContract = createAsyncThunk(
  "contract/deleteContract",
  async (contractId, thunkAPI) => {
    try {
      const { rc } = await http.delete("/auth/hopdong", {
        data: { id: contractId },
        signal: thunkAPI.signal,
      });
      if (!rc || rc.code !== 0) {
        message.error(rc?.desc || "Lỗi không xác định!");
        return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
      }
      return contractId;
    } catch (error) {
      message.error("Xóa hợp đồng thất bại!");
      return thunkAPI.rejectWithValue("Xóa hợp đồng thất bại!");
    }
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
    builder.addCase(getContractList.fulfilled, (state, action) => {
        state.contractList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addContract.fulfilled, (state, action) => {
        state.contractList.push(action.payload);
        state.totalCount = state.totalCount + 1;
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
          state.totalCount = Math.max(0, state.totalCount - 1);
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
