import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractAddendumList: [],
  editingContractAddendum: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeContractAddendumList = [
  {
    id: 1,
    code: "PL-CTR001-01",
    name: "Phụ lục bổ sung phần móng cọc",
    project: "Khu đô thị Phú Mỹ Hưng",
    category: "Móng và kết cấu",
    contract: "CTR-2023-001",
    contractor: "Công ty TNHH Xây dựng ABC",
    supervisor: "Công ty Giám sát XYZ",
    designer: "Tư vấn Thiết kế 123",
    signDate: "25/08/2023",
    effectiveDate: "01/09/2023",
    amount: "2.350.000.000 VNĐ",
    content: "Bổ sung 15 cọc khoan nhồi đường kính 1.5m, chiều sâu 25m",
    reason: "Điều kiện địa chất thực tế yêu cầu gia cố nền móng"
  },
  {
    id: 2,
    code: "PL-CTR002-01",
    name: "Phụ lục thay đổi thiết bị chiếu sáng",
    project: "Cầu Nhật Tân",
    category: "Điện chiếu sáng",
    contract: "CTR-2023-002",
    contractor: "Công ty Điện lực MHT",
    supervisor: "Công ty CP Tư vấn Kỹ thuật Điện",
    designer: "Công ty Tư vấn Thiết kế Ánh Sáng",
    signDate: "12/10/2023",
    effectiveDate: "15/10/2023",
    amount: "750.000.000 VNĐ",
    content: "Thay đổi từ đèn LED 100W sang đèn LED 150W tiết kiệm năng lượng",
    reason: "Cải thiện hiệu suất và giảm chi phí vận hành dài hạn"
  },
  {
    id: 3, 
    code: "PL-CTR003-01",
    name: "Phụ lục điều chỉnh thiết kế mặt tiền",
    project: "Tòa nhà Landmark 81",
    category: "Thiết kế kiến trúc",
    contract: "CTR-2023-003",
    contractor: "Công ty Tư vấn Kiến trúc Sao Việt",
    supervisor: "Công ty TNHH Tư vấn APAVE",
    designer: "Công ty Tư vấn Kiến trúc Sao Việt",
    signDate: "05/11/2023",
    effectiveDate: "15/11/2023",
    amount: "1.800.000.000 VNĐ",
    content: "Điều chỉnh thiết kế mặt dựng kính phản quang và hệ thống chiếu sáng mặt tiền",
    reason: "Đáp ứng yêu cầu mới về tiết kiệm năng lượng và thẩm mỹ kiến trúc"
  },
  {
    id: 4,
    code: "PL-CTR001-02",
    name: "Phụ lục gia hạn thời gian thi công",
    project: "Khu đô thị Phú Mỹ Hưng",
    category: "Thời gian",
    contract: "CTR-2023-001",
    contractor: "Công ty TNHH Xây dựng ABC",
    supervisor: "Công ty Giám sát XYZ",
    designer: "Tư vấn Thiết kế 123",
    signDate: "20/12/2023",
    effectiveDate: "01/01/2024",
    amount: "0 VNĐ",
    content: "Gia hạn thời gian hoàn thành phần móng thêm 30 ngày",
    reason: "Thời tiết bất lợi và sự cố đào đất không lường trước"
  },
  {
    id: 5,
    code: "PL-CTR005-01",
    name: "Phụ lục bổ sung vật liệu cao cấp",
    project: "Khu công nghiệp Vân Trung",
    category: "Vật liệu",
    contract: "CTR-2023-005",
    contractor: "Công ty TNHH Vật liệu Xây dựng Hòa Phát",
    supervisor: "Công ty CP Giám sát Công trình",
    designer: "Viện Khoa học Công nghệ Xây dựng",
    signDate: "10/01/2024",
    effectiveDate: "15/01/2024",
    amount: "3.200.000.000 VNĐ",
    content: "Bổ sung vật liệu composite chống cháy cho hệ thống vách ngăn",
    reason: "Nâng cấp tiêu chuẩn phòng cháy chữa cháy theo quy định mới"
  }
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
