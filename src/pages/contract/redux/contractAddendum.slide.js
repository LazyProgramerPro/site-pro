import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractAddendumList: [],
  totalCount: 0,
  editingContractAddendum: null,
  loading: false,
  currentRequestId: undefined,

};


export const getContractAddendumList = createAsyncThunk(
  "contractAddendum/getContractAddendumList",
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post(
      "/auth/phuluchopdong/list",
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

export const addContractAddendum = createAsyncThunk(
  "contractAddendum/addContractAddendum",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.post("/auth/phuluchopdong/add", body, {
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

export const updateContractAddendum = createAsyncThunk(
  "contractAddendum/updateContractAddendum",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.put("/auth/phuluchopdong/update", body, {
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

export const deleteContractAddendum = createAsyncThunk(
  "contractAddendum/deleteContractAddendum",
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
  },  extraReducers(builder) {
    builder
      .addCase(getContractAddendumList.fulfilled, (state, action) => {
        state.contractAddendumList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addContractAddendum.fulfilled, (state, action) => {
        state.contractAddendumList.push(action.payload);
        state.totalCount = state.totalCount + 1;
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

export const { startEditingContractAddendum, cancelEditingContractAddendum } =
  contractAddendumSlice.actions;
const contractAddendumReducer = contractAddendumSlice.reducer;
export default contractAddendumReducer;
