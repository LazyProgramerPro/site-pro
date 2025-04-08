import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  problemList: [],
  editingProblem: null,
  loading: false,
  currentRequestId: undefined,
};

// Sample problem data for testing
const fakeProblemList = [
  {
    id: 1,
    code: "VD-001",
    name: "Nứt kết cấu móng cọc khu B",
    type: "Kỹ thuật",
    project: "Khu đô thị Phú Mỹ Hưng",
    contractAppendix: "PL-CTR001-01",
    creator: "Trần Văn B",
    createdAt: "15/02/2024",
    status: "Đang xử lý",
    priority: "Cao",
    description: "Phát hiện vết nứt kết cấu tại móng cọc khu B, cần đánh giá kỹ thuật khẩn cấp",
    impact: "Ảnh hưởng tiến độ thi công và an toàn công trình",
    assignedTo: "Nguyễn Văn A - Kỹ sư kết cấu",
    reportedDate: "15/02/2024",
    dueDate: "25/02/2024",
    solution: "Đang tiến hành đánh giá, có thể cần gia cố thêm kết cấu",
    attachments: ["Báo cáo hiện trạng", "Hình ảnh vết nứt", "Bản vẽ kỹ thuật"]
  },
  {
    id: 2,
    code: "VD-002",
    name: "Chậm tiến độ cung cấp thiết bị điện",
    type: "Tiến độ",
    project: "Cầu Nhật Tân",
    contractAppendix: "PL-CTR002-01",
    creator: "Lê Minh C",
    createdAt: "20/02/2024",
    status: "Chờ phản hồi",
    priority: "Trung bình",
    description: "Nhà cung cấp chậm giao thiết bị điện theo kế hoạch, ảnh hưởng tiến độ thi công",
    impact: "Có thể làm chậm 2 tuần so với kế hoạch",
    assignedTo: "Phạm Thị D - Quản lý dự án",
    reportedDate: "20/02/2024",
    dueDate: "05/03/2024",
    solution: "Đã liên hệ nhà cung cấp, họ hứa sẽ giao hàng vào ngày 01/03/2024",
    attachments: ["Biên bản làm việc", "Lịch giao hàng điều chỉnh"]
  },
  {
    id: 3,
    code: "VD-003",
    name: "Sai sót trong thiết kế mặt dựng",
    type: "Thiết kế",
    project: "Tòa nhà Landmark 81",
    contractAppendix: "PL-CTR003-01",
    creator: "Nguyễn Hoàng E",
    createdAt: "28/02/2024",
    status: "Đã giải quyết",
    priority: "Cao",
    description: "Phát hiện sai sót trong bản vẽ thiết kế mặt dựng tầng 45-50",
    impact: "Cần điều chỉnh thiết kế, tác động đến vật liệu đã đặt hàng",
    assignedTo: "Trần Minh F - Kiến trúc sư trưởng",
    reportedDate: "28/02/2024",
    dueDate: "10/03/2024",
    solution: "Đã cập nhật bản vẽ và thông báo cho các bên liên quan, điều chỉnh đơn hàng vật liệu",
    attachments: ["Bản vẽ cập nhật", "Biên bản họp kỹ thuật", "Phê duyệt điều chỉnh"]
  },
  {
    id: 4,
    code: "VD-004",
    name: "Kiểm tra chất lượng vật liệu không đạt",
    type: "Chất lượng",
    project: "Khu công nghiệp Vân Trung",
    contractAppendix: "PL-CTR005-01",
    creator: "Vũ Thị G",
    createdAt: "05/03/2024",
    status: "Đã đóng",
    priority: "Cao",
    description: "Mẫu vách ngăn composite không đạt tiêu chuẩn chống cháy yêu cầu",
    impact: "Phải thay thế vật liệu, tăng chi phí và thời gian",
    assignedTo: "Lê Văn H - Giám sát chất lượng",
    reportedDate: "05/03/2024",
    dueDate: "15/03/2024",
    solution: "Đã thay đổi nhà cung cấp và đặt mẫu vật liệu mới, đã kiểm tra đạt yêu cầu",
    attachments: ["Báo cáo thử nghiệm", "Hợp đồng nhà cung cấp mới", "Mẫu chứng nhận vật liệu"]
  },
  {
    id: 5,
    code: "VD-005",
    name: "Tranh chấp với cộng đồng địa phương",
    type: "Xã hội",
    project: "Đường cao tốc Bắc Nam",
    contractAppendix: "PL-CTR004-01",
    creator: "Phạm Văn I",
    createdAt: "10/03/2024",
    status: "Đang xử lý",
    priority: "Cao",
    description: "Người dân địa phương phản đối việc thi công do lo ngại ô nhiễm và tiếng ồn",
    impact: "Công trình có thể bị dừng tạm thời",
    assignedTo: "Nguyễn Thị K - Quan hệ cộng đồng",
    reportedDate: "10/03/2024",
    dueDate: "30/03/2024",
    solution: "Đang tổ chức họp với đại diện địa phương để giải thích biện pháp giảm thiểu tác động",
    attachments: ["Biên bản họp cộng đồng", "Kế hoạch giảm thiểu tác động môi trường"]
  },
  {
    id: 6,
    code: "VD-006",
    name: "Vượt ngân sách thi công phần hoàn thiện",
    type: "Tài chính",
    project: "Khu đô thị Phú Mỹ Hưng",
    contractAppendix: "PL-CTR001-02",
    creator: "Trần Minh L",
    createdAt: "15/03/2024",
    status: "Mới tạo",
    priority: "Trung bình",
    description: "Chi phí hoàn thiện vượt 15% so với dự toán ban đầu",
    impact: "Vượt ngân sách dự án, cần phê duyệt bổ sung",
    assignedTo: "Lê Thị M - Giám đốc tài chính",
    reportedDate: "15/03/2024",
    dueDate: "05/04/2024",
    solution: "Đang đánh giá các hạng mục có thể điều chỉnh để tiết kiệm chi phí",
    attachments: ["Báo cáo chi phí", "Dự toán điều chỉnh", "Đề xuất phê duyệt"]
  },
  {
    id: 7,
    code: "VD-007",
    name: "Thiếu nhân lực thi công",
    type: "Nguồn lực",
    project: "Metro Bến Thành - Suối Tiên",
    contractAppendix: "PL-CTR007-01",
    creator: "Nguyễn Văn N",
    createdAt: "20/03/2024",
    status: "Tạm hoãn",
    priority: "Thấp",
    description: "Thiếu nhân công có kỹ năng cho hệ thống PCCC phức tạp",
    impact: "Có thể chậm tiến độ 1-2 tuần",
    assignedTo: "Trần Thị O - Quản lý nhân sự",
    reportedDate: "20/03/2024",
    dueDate: "10/04/2024",
    solution: "Đang tuyển dụng thêm và tổ chức đào tạo nhanh cho công nhân hiện có",
    attachments: ["Kế hoạch nhân sự", "Lịch đào tạo", "Thông báo tuyển dụng"]
  },
  {
    id: 8,
    code: "VD-008",
    name: "Ảnh hưởng từ thời tiết xấu",
    type: "Ngoại cảnh",
    project: "Đập Thủy điện Sơn La",
    contractAppendix: "PL-CTR008-01",
    creator: "Lê Văn P",
    createdAt: "25/03/2024",
    status: "Chờ phản hồi",
    priority: "Cao",
    description: "Mưa lớn kéo dài làm ngập khu vực thi công",
    impact: "Dừng thi công ít nhất 1 tuần, thiết bị có thể bị hư hại",
    assignedTo: "Vũ Minh Q - Quản lý công trường",
    reportedDate: "25/03/2024",
    dueDate: "15/04/2024",
    solution: "Đang triển khai hệ thống bơm nước và bảo vệ thiết bị, chuẩn bị phương án bù tiến độ",
    attachments: ["Báo cáo thời tiết", "Hình ảnh hiện trường", "Kế hoạch khắc phục"]
  },
  {
    id: 9,
    code: "VD-009",
    name: "Phát hiện di tích lịch sử trong quá trình đào móng",
    type: "Pháp lý",
    project: "Khu đô thị Phú Mỹ Hưng",
    contractAppendix: "PL-CTR001-01",
    creator: "Phạm Thị R",
    createdAt: "01/04/2024",
    status: "Đang xử lý",
    priority: "Cao",
    description: "Phát hiện di tích lịch sử trong quá trình đào móng khu C",
    impact: "Tạm dừng thi công để chờ cơ quan chức năng khảo sát",
    assignedTo: "Nguyễn Văn S - Giám đốc dự án",
    reportedDate: "01/04/2024",
    dueDate: "30/04/2024",
    solution: "Đã báo cáo sở Văn hóa, đang chờ khảo sát và hướng dẫn xử lý",
    attachments: ["Biên bản phát hiện", "Công văn báo cáo", "Hình ảnh di tích"]
  },
  {
    id: 10,
    code: "VD-010",
    name: "Lỗi hệ thống điều khiển thang máy",
    type: "Kỹ thuật",
    project: "Tòa nhà Landmark 81",
    contractAppendix: "PL-CTR010-01",
    creator: "Trần Văn T",
    createdAt: "05/04/2024",
    status: "Đã giải quyết",
    priority: "Cao",
    description: "Lỗi phần mềm điều khiển hệ thống thang máy tốc độ cao",
    impact: "Không thể tiến hành thử nghiệm theo kế hoạch",
    assignedTo: "Lê Minh U - Kỹ sư cơ điện",
    reportedDate: "05/04/2024",
    dueDate: "15/04/2024",
    solution: "Đã liên hệ nhà cung cấp, cài đặt bản cập nhật phần mềm mới và thử nghiệm thành công",
    attachments: ["Báo cáo lỗi", "Hướng dẫn cập nhật", "Biên bản nghiệm thu"]
  }
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
