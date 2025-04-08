import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractList: [],
  editingContract: null,
  loading: false,
  currentRequestId: undefined,
};

// Sample contract data for testing
const fakeContractList = [
  {
    id: 1,
    contractCode: "CTR-2023-001",
    contractName: "Hợp đồng thi công phần móng",
    projectName: "Khu đô thị Phú Mỹ Hưng",
    construction: "Phần móng và tầng hầm",
    partyB: "Công ty TNHH Xây dựng ABC",
  },
  {
    id: 2,
    contractCode: "CTR-2023-002",
    contractName: "Hợp đồng cung cấp và lắp đặt thiết bị điện",
    projectName: "Cầu Nhật Tân",
    construction: "Hệ thống điện chiếu sáng",
    partyB: "Công ty Điện lực MHT",
  },
  {
    id: 3,
    contractCode: "CTR-2023-003",
    contractName: "Hợp đồng tư vấn thiết kế kiến trúc",
    projectName: "Tòa nhà Landmark 81",
    construction: "Thiết kế kiến trúc",
    partyB: "Công ty Tư vấn Kiến trúc Sao Việt",
  },
  {
    id: 4,
    contractCode: "CTR-2023-004",
    contractName: "Hợp đồng thi công hạ tầng kỹ thuật",
    projectName: "Đường cao tốc Bắc Nam",
    construction: "Hệ thống thoát nước và cấp nước",
    partyB: "Tổng công ty Xây dựng Công trình Giao thông",
  },
  {
    id: 5,
    contractCode: "CTR-2023-005",
    contractName: "Hợp đồng cung cấp vật liệu xây dựng",
    projectName: "Khu công nghiệp Vân Trung",
    construction: "Vật liệu xây dựng",
    partyB: "Công ty TNHH Vật liệu Xây dựng Hòa Phát",
  },
  {
    id: 6,
    contractCode: "CTR-2023-006",
    contractName: "Hợp đồng thi công phần thô",
    projectName: "Nhà máy nhiệt điện Vũng Áng",
    construction: "Thi công phần thô",
    partyB: "Công ty Cổ phần Xây lắp Điện 1",
  },
  {
    id: 7,
    contractCode: "CTR-2023-007",
    contractName: "Hợp đồng lắp đặt hệ thống PCCC",
    projectName: "Metro Bến Thành - Suối Tiên",
    construction: "Hệ thống PCCC",
    partyB: "Công ty TNHH PCCC An Toàn",
  },
  {
    id: 8,
    contractCode: "CTR-2023-008",
    contractName: "Hợp đồng tư vấn giám sát",
    projectName: "Đập Thủy điện Sơn La",
    construction: "Giám sát thi công",
    partyB: "Công ty Cổ phần Tư vấn Xây dựng Điện 2",
  },
  {
    id: 9,
    contractCode: "CTR-2024-001",
    contractName: "Hợp đồng thi công hoàn thiện",
    projectName: "Khu đô thị Phú Mỹ Hưng",
    construction: "Hoàn thiện nội thất",
    partyB: "Công ty Cổ phần Nội thất Toàn Cầu",
  },
  {
    id: 10,
    contractCode: "CTR-2024-002",
    contractName: "Hợp đồng lắp đặt hệ thống điều hòa",
    projectName: "Tòa nhà Landmark 81",
    construction: "Hệ thống điều hòa trung tâm",
    partyB: "Công ty TNHH Kỹ thuật Lạnh",
  }
];

// You can use this data in your Redux store or for testing purposes
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
