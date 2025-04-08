import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  acceptanceRequestList: [],
  editingAcceptanceRequest: null,
  loading: false,
  currentRequestId: undefined,
};

// Sample acceptance request data for testing
const fakeAcceptanceRequestList = [
  {
    id: 1,
    code: "YC-NT-001",
    name: "Nghiệm thu móng và tầng hầm",
    project: "Khu đô thị Phú Mỹ Hưng",
    contractAppendix: "PL-CTR001-01",
    createdAt: "10/02/2024",
    status: "Đã duyệt",
    completionDate: "05/02/2024",
    requestedBy: "Công ty TNHH Xây dựng ABC",
    approvedBy: "Nguyễn Văn A",
    approvalDate: "15/02/2024",
    description: "Nghiệm thu phần móng và tầng hầm đã hoàn thành theo thiết kế",
    completionPercent: "100%",
    paymentAmount: "6.250.000.000 VNĐ",
    inspectionDate: "12/02/2024",
    observations: "Công trình đạt yêu cầu kỹ thuật và chất lượng",
    supportingDocuments: ["Biên bản kiểm tra", "Hình ảnh công trình", "Báo cáo thử nghiệm bê tông"],
    teamMembers: ["Trần Văn B - Kỹ sư giám sát", "Lê Văn C - Đại diện nhà thầu", "Phạm Văn D - Đại diện chủ đầu tư"]
  },
  {
    id: 2,
    code: "YC-NT-002",
    name: "Nghiệm thu hệ thống điện chiếu sáng",
    project: "Cầu Nhật Tân",
    contractAppendix: "PL-CTR002-01",
    createdAt: "20/02/2024",
    status: "Đang xem xét",
    completionDate: "18/02/2024", 
    requestedBy: "Công ty Điện lực MHT",
    approvedBy: null,
    approvalDate: null,
    description: "Nghiệm thu hệ thống chiếu sáng đã hoàn thành lắp đặt theo thiết kế mới",
    completionPercent: "100%",
    paymentAmount: "1.500.000.000 VNĐ",
    inspectionDate: "25/02/2024",
    observations: "Đang chờ thử nghiệm vận hành hệ thống",
    supportingDocuments: ["Bản vẽ hoàn công", "Chứng nhận thiết bị", "Biên bản bàn giao"],
    teamMembers: ["Nguyễn Thị E - Kỹ sư điện", "Trần Văn F - Đại diện nhà thầu"]
  },
  {
    id: 3,
    code: "YC-NT-003",
    name: "Nghiệm thu mặt dựng kính",
    project: "Tòa nhà Landmark 81",
    contractAppendix: "PL-CTR003-01",
    createdAt: "05/03/2024",
    status: "Yêu cầu chỉnh sửa",
    completionDate: "28/02/2024",
    requestedBy: "Công ty Tư vấn Kiến trúc Sao Việt",
    approvedBy: null,
    approvalDate: null,
    description: "Nghiệm thu hệ thống mặt dựng kính phản quang đã lắp đặt",
    completionPercent: "95%",
    paymentAmount: "3.800.000.000 VNĐ",
    inspectionDate: "08/03/2024",
    observations: "Cần điều chỉnh một số vị trí kính không đảm bảo kín nước",
    supportingDocuments: ["Biên bản kiểm tra", "Báo cáo lỗi", "Hình ảnh hiện trạng"],
    teamMembers: ["Lê Văn G - Kỹ sư giám sát", "Trần Thị H - Đại diện nhà thầu"]
  },
  {
    id: 4,
    code: "YC-NT-004",
    name: "Nghiệm thu vách ngăn chống cháy",
    project: "Khu công nghiệp Vân Trung",
    contractAppendix: "PL-CTR005-01", 
    createdAt: "15/03/2024",
    status: "Đã từ chối",
    completionDate: "10/03/2024",
    requestedBy: "Công ty TNHH Vật liệu Xây dựng Hòa Phát",
    approvedBy: "Vũ Văn I",
    approvalDate: "20/03/2024",
    description: "Nghiệm thu hệ thống vách ngăn composite chống cháy đã lắp đặt",
    completionPercent: "100%",
    paymentAmount: "2.800.000.000 VNĐ",
    inspectionDate: "18/03/2024",
    observations: "Vật liệu không đạt chuẩn chống cháy theo quy định, yêu cầu thay thế",
    supportingDocuments: ["Biên bản thử nghiệm", "Báo cáo không đạt yêu cầu", "Văn bản từ chối"],
    teamMembers: ["Nguyễn Văn K - Giám đốc PCCC", "Phạm Thị L - Đại diện nhà thầu"]
  },
  {
    id: 5,
    code: "YC-NT-005",
    name: "Nghiệm thu hệ thống thoát nước",
    project: "Đường cao tốc Bắc Nam",
    contractAppendix: "PL-CTR004-01",
    createdAt: "25/03/2024", 
    status: "Mới tạo",
    completionDate: "22/03/2024",
    requestedBy: "Tổng công ty Xây dựng Công trình Giao thông",
    approvedBy: null,
    approvalDate: null,
    description: "Nghiệm thu hệ thống thoát nước dọc tuyến đã thi công hoàn thiện",
    completionPercent: "100%",
    paymentAmount: "4.200.000.000 VNĐ",
    inspectionDate: null,
    observations: null,
    supportingDocuments: ["Bản vẽ hoàn công", "Biên bản nghiệm thu nội bộ", "Hồ sơ vật liệu"],
    teamMembers: ["Trần Văn M - Đại diện nhà thầu", "Lê Thị N - Kỹ thuật viên"]
  },
  {
    id: 6,
    code: "YC-NT-006",
    name: "Nghiệm thu hệ thống PCCC",
    project: "Metro Bến Thành - Suối Tiên",
    contractAppendix: "PL-CTR007-01",
    createdAt: "02/04/2024",
    status: "Đã duyệt",
    completionDate: "30/03/2024",
    requestedBy: "Công ty TNHH PCCC An Toàn",
    approvedBy: "Phạm Văn O",
    approvalDate: "05/04/2024",
    description: "Nghiệm thu hệ thống PCCC đã lắp đặt hoàn thiện",
    completionPercent: "100%",
    paymentAmount: "3.500.000.000 VNĐ",
    inspectionDate: "03/04/2024",
    observations: "Hệ thống hoạt động tốt, đạt yêu cầu kỹ thuật",
    supportingDocuments: ["Biên bản thử nghiệm", "Chứng nhận thiết bị", "Biên bản nghiệm thu"],
    teamMembers: ["Vũ Văn P - Kỹ sư PCCC", "Nguyễn Thị Q - Đại diện nhà thầu"]
  }
];

export const getAcceptanceRequestList = createAsyncThunk(
  "acceptanceRequest/getAcceptanceRequestList",
  async (searchTerm, thunkAPI) => {
    console.log("getAcceptanceRequestList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeAcceptanceRequestList;
    }

    const filteredRequests = fakeAcceptanceRequestList.filter((request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredRequests;
  }
);

export const addAcceptanceRequest = createAsyncThunk(
  "acceptanceRequest/addAcceptanceRequest",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("acceptanceRequests", body, {
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

export const updateAcceptanceRequest = createAsyncThunk(
  "acceptanceRequest/updateAcceptanceRequest",
  async ({ requestId, body }, thunkAPI) => {
    try {
      const response = await http.put(`acceptanceRequests/${requestId}`, body, {
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

export const deleteAcceptanceRequest = createAsyncThunk(
  "acceptanceRequest/deleteAcceptanceRequest",
  async (requestId, thunkAPI) => {
    const response = await http.delete(`acceptanceRequests/${requestId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const acceptanceRequestSlice = createSlice({
  name: "acceptanceRequest",
  initialState,
  reducers: {
    startEditingAcceptanceRequest: (state, action) => {
      const requestId = action.payload;
      const foundRequest =
        state.acceptanceRequestList.find(
          (request) => request.id === requestId
        ) || null;
      state.editingAcceptanceRequest = foundRequest;
    },
    cancelEditingAcceptanceRequest: (state) => {
      state.editingAcceptanceRequest = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAcceptanceRequestList.fulfilled, (state, action) => {
        state.acceptanceRequestList = action.payload;
      })
      .addCase(addAcceptanceRequest.fulfilled, (state, action) => {
        state.acceptanceRequestList.push(action.payload);
      })
      .addCase(updateAcceptanceRequest.fulfilled, (state, action) => {
        state.acceptanceRequestList.find((request, index) => {
          if (request.id === action.payload.id) {
            state.acceptanceRequestList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingAcceptanceRequest = null;
      })

      .addCase(deleteAcceptanceRequest.fulfilled, (state, action) => {
        const requestId = action.meta.arg;
        const deleteRequestIndex = state.acceptanceRequestList.findIndex(
          (request) => request.id === requestId
        );
        if (deleteRequestIndex !== -1) {
          state.acceptanceRequestList.splice(deleteRequestIndex, 1);
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

export const {
  startEditingAcceptanceRequest,
  cancelEditingAcceptanceRequest,
} = acceptanceRequestSlice.actions;
const acceptanceRequestReducer = acceptanceRequestSlice.reducer;
export default acceptanceRequestReducer;
