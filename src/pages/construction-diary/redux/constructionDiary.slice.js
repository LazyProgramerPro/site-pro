import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  constructionDiaryList: [],
  editingConstructionDiary: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeConstructionDiaryList = [
  {
    id: 1,
    diaryCode: "NK-001",
    name: "Nhật ký thi công móng",
    projectName: "Khu đô thị Phú Mỹ Hưng",
    construction: "Móng cọc",
    type: "Thi công",
    createdAt: "15/02/2024",
    status: "Đã duyệt",
    content: "Thi công đổ bê tông móng khu B, hoàn thành 15/20 móng cọc theo kế hoạch",
    weather: "Nắng nhẹ",
    temperature: "28°C-32°C",
    workforce: {
      engineers: 4,
      workers: 25,
      supervisors: 2
    },
    equipment: [
      "2 máy đào Komatsu PC200",
      "1 cần cẩu 50 tấn",
      "3 máy trộn bê tông"
    ],
    materials: [
      "Bê tông mác 300: 120m³",
      "Thép hình: 15 tấn",
      "Cốt thép: 8 tấn"
    ],
    activities: [
      "Hoàn thành đổ bê tông 8 móng cọc khu B",
      "Chuẩn bị vật liệu cho ngày mai",
      "Kiểm tra độ sụt bê tông"
    ],
    issues: [
      "Giao thông vận chuyển bê tông bị chậm do kẹt xe"
    ],
    notes: "Cần điều chỉnh kế hoạch vận chuyển bê tông để tránh giờ cao điểm",
    images: ["image1.jpg", "image2.jpg", "image3.jpg"],
    authorName: "Nguyễn Văn A",
    authorPosition: "Kỹ sư giám sát",
    approvedBy: "Trần Văn B",
    approvalDate: "16/02/2024"
  },
  {
    id: 2,
    diaryCode: "NK-002",
    name: "Nhật ký lắp đặt hệ thống điện",
    projectName: "Cầu Nhật Tân",
    construction: "Hệ thống điện",
    type: "Lắp đặt",
    createdAt: "20/02/2024",
    status: "Đã duyệt",
    content: "Lắp đặt hệ thống chiếu sáng đoạn 2 của cầu, hoàn thành khoảng 60% khối lượng",
    weather: "Có mưa nhẹ",
    temperature: "25°C-27°C",
    workforce: {
      engineers: 3,
      workers: 15,
      supervisors: 1
    },
    equipment: [
      "2 xe nâng người",
      "1 máy phát điện dự phòng",
      "Bộ dụng cụ điện"
    ],
    materials: [
      "Cáp điện: 300m",
      "Đèn LED 150W: 25 bộ",
      "Tủ điện: 2 bộ"
    ],
    activities: [
      "Kéo cáp điện cho đoạn 2 (300m)",
      "Lắp đặt 15 bộ đèn LED",
      "Kiểm tra hoạt động hệ thống"
    ],
    issues: [
      "Một số đèn không hoạt động do lỗi kết nối"
    ],
    notes: "Đã liên hệ với nhà cung cấp để thay thế đèn bị lỗi",
    images: ["image4.jpg", "image5.jpg"],
    authorName: "Lê Minh C",
    authorPosition: "Kỹ sư điện",
    approvedBy: "Phạm Thị D",
    approvalDate: "21/02/2024"
  },
  {
    id: 3,
    diaryCode: "NK-003",
    name: "Nhật ký thi công mặt dựng",
    projectName: "Tòa nhà Landmark 81",
    construction: "Mặt dựng",
    type: "Thi công",
    createdAt: "25/02/2024",
    status: "Mới tạo",
    content: "Lắp đặt hệ thống mặt dựng kính từ tầng 45-50, hoàn thành 3/5 tầng",
    weather: "Nắng, gió nhẹ",
    temperature: "30°C-34°C",
    workforce: {
      engineers: 5,
      workers: 30,
      supervisors: 3
    },
    equipment: [
      "4 gondola",
      "2 cần cẩu tháp",
      "Hệ thống giàn giáo treo"
    ],
    materials: [
      "Kính cường lực phản quang: 250m²",
      "Khung nhôm: 350m",
      "Vật tư kết nối: 500 bộ"
    ],
    activities: [
      "Lắp đặt khung nhôm tầng 45-47",
      "Lắp kính mặt dựng tầng 45-46",
      "Kiểm tra kín nước tầng 45"
    ],
    issues: [
      "Độ kín nước tại một số vị trí chưa đạt yêu cầu",
      "Gió lớn gây khó khăn cho công tác lắp đặt buổi chiều"
    ],
    notes: "Cần rà soát lại toàn bộ các vị trí đã lắp để đảm bảo kín nước",
    images: ["image6.jpg", "image7.jpg", "image8.jpg"],
    authorName: "Trần Minh E",
    authorPosition: "Kỹ sư xây dựng",
    approvedBy: null,
    approvalDate: null
  },
  {
    id: 4,
    diaryCode: "NK-004",
    name: "Nhật ký thi công đường",
    projectName: "Đường cao tốc Bắc Nam",
    construction: "Mặt đường",
    type: "Thi công",
    createdAt: "01/03/2024",
    status: "Đã duyệt",
    content: "Thi công lớp bê tông nhựa mặt đường Km15-Km17, hoàn thành 1.5km",
    weather: "Nắng, nhiệt độ cao",
    temperature: "35°C-38°C",
    workforce: {
      engineers: 4,
      workers: 35,
      supervisors: 2
    },
    equipment: [
      "2 máy rải bê tông nhựa",
      "4 xe lu",
      "8 xe tải vận chuyển",
      "1 máy phun nhựa"
    ],
    materials: [
      "Bê tông nhựa nóng: 1200 tấn",
      "Nhựa đường: 25 tấn"
    ],
    activities: [
      "Rải bê tông nhựa đoạn Km15-Km16.5",
      "Lu lèn đạt độ chặt theo yêu cầu",
      "Lấy mẫu kiểm tra chất lượng"
    ],
    issues: [
      "Nhiệt độ cao ảnh hưởng đến chất lượng bê tông nhựa"
    ],
    notes: "Điều chỉnh lịch làm việc sang sáng sớm và chiều tối để tránh nóng",
    images: ["image9.jpg", "image10.jpg"],
    authorName: "Phạm Văn F",
    authorPosition: "Kỹ sư đường",
    approvedBy: "Nguyễn Thị G",
    approvalDate: "02/03/2024"
  },
  {
    id: 5,
    diaryCode: "NK-005",
    name: "Nhật ký lắp đặt vách ngăn",
    projectName: "Khu công nghiệp Vân Trung",
    construction: "Vách ngăn",
    type: "Lắp đặt",
    createdAt: "05/03/2024",
    status: "Đang xem xét",
    content: "Lắp đặt vách ngăn composite chống cháy cho khu nhà xưởng A1",
    weather: "Mây, thỉnh thoảng có mưa",
    temperature: "26°C-29°C",
    workforce: {
      engineers: 2,
      workers: 18,
      supervisors: 1
    },
    equipment: [
      "2 xe nâng người",
      "Dụng cụ lắp đặt chuyên dụng"
    ],
    materials: [
      "Tấm composite chống cháy: 350m²",
      "Khung thép mạ kẽm: 400m",
      "Vật tư kết nối: 300 bộ"
    ],
    activities: [
      "Lắp đặt khung thép cho vách ngăn",
      "Lắp đặt tấm composite (hoàn thành 60%)",
      "Kiểm tra độ thẳng đứng và liên kết"
    ],
    issues: [
      "Phát hiện một số tấm composite không đúng thông số kỹ thuật"
    ],
    notes: "Đã yêu cầu nhà cung cấp kiểm tra và thay thế các tấm không đạt chuẩn",
    images: ["image11.jpg", "image12.jpg"],
    authorName: "Lê Văn H",
    authorPosition: "Kỹ sư giám sát",
    approvedBy: null,
    approvalDate: null
  },
  {
    id: 6,
    diaryCode: "NK-006",
    name: "Nhật ký đổ sàn tầng 5",
    projectName: "Tòa nhà Landmark 81",
    construction: "Sàn bê tông",
    type: "Thi công",
    createdAt: "10/03/2024",
    status: "Đã duyệt",
    content: "Đổ bê tông sàn tầng 5, diện tích 1200m²",
    weather: "Quang mây",
    temperature: "29°C-32°C",
    workforce: {
      engineers: 3,
      workers: 28,
      supervisors: 2
    },
    equipment: [
      "1 bơm bê tông tĩnh",
      "2 máy đầm dùi",
      "1 máy mài nền",
      "5 xe trộn bê tông"
    ],
    materials: [
      "Bê tông mác 350: 240m³",
      "Lưới thép: 1200m²"
    ],
    activities: [
      "Đổ bê tông sàn từ 7:00-14:00",
      "Đầm, tạo phẳng bề mặt",
      "Bảo dưỡng bê tông"
    ],
    issues: [
      "Một số vị trí bị rỗ do đầm không kỹ"
    ],
    notes: "Đã xử lý các vị trí bị rỗ, tiếp tục bảo dưỡng bê tông trong 7 ngày",
    images: ["image13.jpg", "image14.jpg", "image15.jpg"],
    authorName: "Nguyễn Văn I",
    authorPosition: "Chỉ huy trưởng",
    approvedBy: "Trần Văn K",
    approvalDate: "11/03/2024"
  },
  {
    id: 7,
    diaryCode: "NK-007",
    name: "Nhật ký lắp đặt PCCC",
    projectName: "Metro Bến Thành - Suối Tiên",
    construction: "Hệ thống PCCC",
    type: "Lắp đặt",
    createdAt: "15/03/2024",
    status: "Mới tạo",
    content: "Lắp đặt hệ thống phòng cháy chữa cháy cho ga Metro số 3",
    weather: "Nắng",
    temperature: "32°C-35°C",
    workforce: {
      engineers: 4,
      workers: 20,
      supervisors: 2
    },
    equipment: [
      "Dụng cụ lắp đặt chuyên dụng",
      "1 máy bơm thử áp",
      "Thiết bị kiểm tra hệ thống"
    ],
    materials: [
      "Đầu phun sprinkler: 150 bộ",
      "Ống thép mạ kẽm: 500m",
      "Van điều khiển: 15 bộ",
      "Tủ điều khiển chữa cháy: 2 bộ"
    ],
    activities: [
      "Lắp đặt hệ thống ống dẫn tầng 1",
      "Lắp đặt đầu phun sprinkler tầng 1",
      "Lắp đặt tủ điều khiển chính"
    ],
    issues: [
      "Một số vị trí có xung đột với hệ thống điện"
    ],
    notes: "Cần phối hợp với đội điện để điều chỉnh vị trí đường ống và thiết bị",
    images: ["image16.jpg", "image17.jpg"],
    authorName: "Trần Minh L",
    authorPosition: "Kỹ sư PCCC",
    approvedBy: null,
    approvalDate: null
  },
  {
    id: 8,
    diaryCode: "NK-008",
    name: "Nhật ký khoan cọc nhồi",
    projectName: "Đập Thủy điện Sơn La",
    construction: "Cọc nhồi",
    type: "Thi công",
    createdAt: "20/03/2024",
    status: "Đã duyệt",
    content: "Khoan cọc nhồi đường kính 1.5m, chiều sâu 30m cho trụ đập phụ số 2",
    weather: "Mây, gió nhẹ",
    temperature: "24°C-28°C",
    workforce: {
      engineers: 5,
      workers: 25,
      supervisors: 3
    },
    equipment: [
      "2 máy khoan cọc nhồi",
      "3 máy trộn bentonite",
      "2 cần cẩu 50 tấn",
      "1 máy bơm bê tông"
    ],
    materials: [
      "Ống vách thép: 60m",
      "Bentonite: 15 tấn",
      "Bê tông: 180m³",
      "Lồng thép: 20 tấn"
    ],
    activities: [
      "Khoan 4 cọc nhồi đến độ sâu thiết kế",
      "Đổ bê tông 3 cọc",
      "Chuẩn bị lồng thép cho cọc còn lại"
    ],
    issues: [
      "Gặp tầng đá cứng ở độ sâu 25m làm chậm tiến độ khoan"
    ],
    notes: "Đã thay đầu khoan chuyên dụng để khoan qua tầng đá",
    images: ["image18.jpg", "image19.jpg", "image20.jpg"],
    authorName: "Phạm Văn M",
    authorPosition: "Kỹ sư địa chất",
    approvedBy: "Nguyễn Thị N",
    approvalDate: "21/03/2024"
  },
  {
    id: 9,
    diaryCode: "NK-009",
    name: "Nhật ký hoàn thiện nội thất",
    projectName: "Khu đô thị Phú Mỹ Hưng",
    construction: "Nội thất",
    type: "Hoàn thiện",
    createdAt: "25/03/2024",
    status: "Đang xem xét",
    content: "Thi công hoàn thiện nội thất khu căn hộ Block B1",
    weather: "Nắng nhẹ",
    temperature: "30°C-33°C",
    workforce: {
      engineers: 2,
      workers: 35,
      supervisors: 1
    },
    equipment: [
      "Dụng cụ hoàn thiện chuyên dụng",
      "1 máy cắt gạch",
      "2 máy khoan"
    ],
    materials: [
      "Gạch ceramic: 500m²",
      "Gỗ ốp tường: 300m²",
      "Sơn nội thất: 200 lít",
      "Thạch cao: 400m²"
    ],
    activities: [
      "Ốp gạch sàn khu vực phòng khách và bếp",
      "Lắp đặt hệ thống trần thạch cao",
      "Sơn tường các phòng ngủ"
    ],
    issues: [
      "Gạch ốp không đúng màu so với mẫu",
      "Hệ thống điện một số căn hộ chưa hoàn thiện"
    ],
    notes: "Liên hệ với nhà cung cấp để đổi gạch, phối hợp với đội điện để hoàn thiện hệ thống",
    images: ["image21.jpg", "image22.jpg"],
    authorName: "Lê Thị O",
    authorPosition: "Kỹ sư nội thất",
    approvedBy: null,
    approvalDate: null
  },
  {
    id: 10,
    diaryCode: "NK-010",
    name: "Nhật ký lắp đặt thang máy",
    projectName: "Tòa nhà Landmark 81",
    construction: "Thang máy",
    type: "Lắp đặt",
    createdAt: "30/03/2024",
    status: "Mới tạo",
    content: "Lắp đặt hệ thống thang máy tốc độ cao cho khu vực văn phòng",
    weather: "Quang mây",
    temperature: "28°C-31°C",
    workforce: {
      engineers: 6,
      workers: 15,
      supervisors: 2
    },
    equipment: [
      "Thiết bị chuyên dụng lắp đặt thang máy",
      "1 cần cẩu mini",
      "Dụng cụ hiệu chỉnh chính xác"
    ],
    materials: [
      "Cabin thang: 4 bộ",
      "Ray dẫn hướng: 800m",
      "Hệ thống điều khiển: 4 bộ",
      "Cáp thang máy: 1200m"
    ],
    activities: [
      "Lắp đặt ray dẫn hướng tầng 20-30",
      "Cài đặt hệ thống điều khiển",
      "Lắp đặt cabin cho 2 thang máy"
    ],
    issues: [
      "Lỗi phần mềm điều khiển khi thử nghiệm ban đầu"
    ],
    notes: "Đã liên hệ với nhà cung cấp để cập nhật phần mềm mới",
    images: ["image23.jpg", "image24.jpg"],
    authorName: "Nguyễn Minh P",
    authorPosition: "Kỹ sư cơ điện",
    approvedBy: null,
    approvalDate: null
  }
];

export const getConstructionDiaryList = createAsyncThunk(
  "construction-diary/getConstructionDiaryList",
  async (searchTerm, thunkAPI) => {
    console.log("getConstructionDiaryList with searchTerm:", searchTerm);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (!searchTerm) {
      return fakeConstructionDiaryList;
    }

    const filteredConstructionDiaries = fakeConstructionDiaryList.filter((diary) =>
      diary.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredConstructionDiaries;
  }
);

export const addConstructionDiary = createAsyncThunk(
  "construction-diary/addConstructionDiary",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("construction-diaries", body, {
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

export const updateConstructionDiary = createAsyncThunk(
  "construction-diary/updateConstructionDiary",
  async ({ diaryId, body }, thunkAPI) => {
    try {
      const response = await http.put(`construction-diaries/${diaryId}`, body, {
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

export const deleteConstructionDiary = createAsyncThunk(
  "construction-diary/deleteConstructionDiary",
  async (diaryId, thunkAPI) => {
    const response = await http.delete(`construction-diaries/${diaryId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const constructionDiarySlice = createSlice({
  name: "construction-diary",
  initialState,
  reducers: {
    startEditingConstructionDiary: (state, action) => {
      const diaryId = action.payload;
      const foundDiary =
        state.constructionDiaryList.find((diary) => diary.id === diaryId) || null;
      state.editingConstructionDiary = foundDiary;
    },
    cancelEditingConstructionDiary: (state) => {
      state.editingConstructionDiary = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConstructionDiaryList.fulfilled, (state, action) => {
        state.constructionDiaryList = action.payload;
      })
      .addCase(addConstructionDiary.fulfilled, (state, action) => {
        state.constructionDiaryList.push(action.payload);
      })
      .addCase(updateConstructionDiary.fulfilled, (state, action) => {
        state.constructionDiaryList.find((diary, index) => {
          if (diary.id === action.payload.id) {
            state.constructionDiaryList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingConstructionDiary = null;
      })

      .addCase(deleteConstructionDiary.fulfilled, (state, action) => {
        const diaryId = action.meta.arg;
        const deleteDiaryIndex = state.constructionDiaryList.findIndex(
          (diary) => diary.id === diaryId
        );
        if (deleteDiaryIndex !== -1) {
          state.constructionDiaryList.splice(deleteDiaryIndex, 1);
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

export const { startEditingConstructionDiary, cancelEditingConstructionDiary } =
  constructionDiarySlice.actions;
const constructionDiaryReducer = constructionDiarySlice.reducer;
export default constructionDiaryReducer;
