import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountList: [],
  editingAccount: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeAccountList = [
  {
    id: 1,
    username: "minhnguyen21",
    fullName: "Nguyễn Văn Minh",
    email: "minhnguyen21@example.com",
    company: "Công ty TNHH Xây dựng Minh Phát",
    position: "Giám đốc",
    role: "Admin",
    key: "1"
  },
  {
    id: 2,
    username: "linhhoang54",
    fullName: "Hoàng Thị Linh",
    email: "linhhoang54@example.com",
    company: "Tập đoàn Vingroup",
    position: "Trưởng phòng",
    role: "Investor",
    key: "2"
  },
  {
    id: 3,
    username: "tuanle33",
    fullName: "Lê Đức Tuấn",
    email: "tuanle33@example.com",
    company: "Tổng công ty Xây dựng Hà Nội",
    position: "Kỹ sư",
    role: "Contractor",
    key: "3"
  },
  {
    id: 4,
    username: "anhpham78",
    fullName: "Phạm Minh Anh",
    email: "anhpham78@example.com",
    company: "Công ty CP Đầu tư Phát triển Đô thị",
    position: "Kiến trúc sư",
    role: "Designer",
    key: "4"
  },
  {
    id: 5,
    username: "hieudo15",
    fullName: "Đỗ Quốc Hiếu",
    email: "hieudo15@example.com",
    company: "Tập đoàn Sunshine Group",
    position: "Quản lý dự án",
    role: "Supervisor",
    key: "5"
  },
  {
    id: 6,
    username: "quanvu62",
    fullName: "Vũ Minh Quân",
    email: "quanvu62@example.com",
    company: "Công ty TNHH Phát triển BĐS Tân Hoàng Minh",
    position: "Chuyên viên",
    role: "Contractor",
    key: "6"
  },
  {
    id: 7,
    username: "thaohoang27",
    fullName: "Hoàng Thị Thảo",
    email: "thaohoang27@example.com",
    company: "Công ty Xây dựng Hòa Bình",
    position: "Giám đốc",
    role: "Admin",
    key: "7"
  },
  {
    id: 8,
    username: "trungnguyen49",
    fullName: "Nguyễn Thanh Trung",
    email: "trungnguyen49@example.com",
    company: "Tập đoàn Capital Land",
    position: "Kỹ thuật viên",
    role: "Supervisor",
    key: "8"
  },
  {
    id: 9,
    username: "maile85",
    fullName: "Lê Thị Mai",
    email: "maile85@example.com",
    company: "Công ty TNHH Đầu tư LDG",
    position: "Phó giám đốc",
    role: "Investor",
    key: "9"
  },
  {
    id: 10,
    username: "hungbui37",
    fullName: "Bùi Đức Hùng",
    email: "hungbui37@example.com",
    company: "Công ty Cổ phần Đầu tư Xây dựng Trung Nam",
    position: "Kỹ sư",
    role: "Contractor",
    key: "10"
  },
  {
    id: 11,
    username: "linhdang11",
    fullName: "Đặng Ngọc Linh",
    email: "linhdang11@example.com",
    company: "Tập đoàn Vingroup",
    position: "Kiến trúc sư",
    role: "Designer",
    key: "11"
  },
  {
    id: 12,
    username: "anhphan67",
    fullName: "Phan Thu Anh",
    email: "anhphan67@example.com",
    company: "Công ty Xây dựng Hòa Bình",
    position: "Quản lý dự án",
    role: "Supervisor",
    key: "12"
  },
  {
    id: 13,
    username: "tuanhoang43",
    fullName: "Hoàng Minh Tuấn",
    email: "tuanhoang43@example.com",
    company: "Tổng công ty Xây dựng Hà Nội",
    position: "Chuyên viên",
    role: "Investor",
    key: "13"
  },
  {
    id: 14,
    username: "minhtran56",
    fullName: "Trần Hữu Minh",
    email: "minhtran56@example.com",
    company: "Công ty TNHH Đầu tư LDG",
    position: "Kỹ sư",
    role: "Contractor",
    key: "14"
  },
  {
    id: 15,
    username: "hieuvu93",
    fullName: "Vũ Đức Hiếu",
    email: "hieuvu93@example.com",
    company: "Công ty CP Đầu tư Phát triển Đô thị",
    position: "Giám đốc",
    role: "Admin",
    key: "15"
  },
  {
    id: 16,
    username: "thaonguyen30",
    fullName: "Nguyễn Thị Thảo",
    email: "thaonguyen30@example.com",
    company: "Tập đoàn Capital Land",
    position: "Trưởng phòng",
    role: "Supervisor",
    key: "16"
  },
  {
    id: 17,
    username: "quanle72",
    fullName: "Lê Minh Quân",
    email: "quanle72@example.com",
    company: "Công ty TNHH Phát triển BĐS Tân Hoàng Minh",
    position: "Kỹ thuật viên",
    role: "Contractor",
    key: "17"
  },
  {
    id: 18,
    username: "hungpham25",
    fullName: "Phạm Hoàng Hùng",
    email: "hungpham25@example.com",
    company: "Tập đoàn Sunshine Group",
    position: "Phó giám đốc",
    role: "Investor",
    key: "18"
  },
  {
    id: 19,
    username: "maido88",
    fullName: "Đỗ Thị Mai",
    email: "maido88@example.com",
    company: "Công ty Cổ phần Đầu tư Xây dựng Trung Nam",
    position: "Kiến trúc sư",
    role: "Designer",
    key: "19"
  },
  {
    id: 20,
    username: "trungdang50",
    fullName: "Đặng Thanh Trung",
    email: "trungdang50@example.com",
    company: "Công ty TNHH Xây dựng Minh Phát",
    position: "Quản lý dự án",
    role: "Supervisor",
    key: "20"
  },
  {
    id: 21,
    username: "anhbui69",
    fullName: "Bùi Thu Anh",
    email: "anhbui69@example.com",
    company: "Tổng công ty Xây dựng Hà Nội",
    position: "Chuyên viên",
    role: "Contractor",
    key: "21"
  },
  {
    id: 22,
    username: "minhphan41",
    fullName: "Phan Văn Minh",
    email: "minhphan41@example.com",
    company: "Tập đoàn Vingroup",
    position: "Kỹ sư",
    role: "Designer",
    key: "22"
  },
  {
    id: 23,
    username: "linhtran77",
    fullName: "Trần Thị Linh",
    email: "linhtran77@example.com",
    company: "Công ty CP Đầu tư Phát triển Đô thị",
    position: "Giám đốc",
    role: "Admin",
    key: "23"
  }
];

export const getAccountList = createAsyncThunk(
  "account/getAccountList",
  async (searchTerm, thunkAPI) => {
    console.log("getAccountList with searchTerm:", searchTerm);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!searchTerm) {
      return fakeAccountList;
    }

    const filteredAccounts = fakeAccountList.filter((account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredAccounts;
  }
);

export const addAccount = createAsyncThunk(
  "account/addAccount",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("accounts", body, {
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

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async ({ accountId, body }, thunkAPI) => {
    try {
      const response = await http.put(`accounts/${accountId}`, body, {
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

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (accountId, thunkAPI) => {
    const response = await http.delete(`accounts/${accountId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    startEditingAccount: (state, action) => {
      const accountId = action.payload;
      const foundAccount =
        state.accountList.find((account) => account.id === accountId) || null;
      state.editingAccount = foundAccount;
    },
    cancelEditingAccount: (state) => {
      state.editingAccount = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAccountList.fulfilled, (state, action) => {
        state.accountList = action.payload;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accountList.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.accountList.find((account, index) => {
          if (account.id === action.payload.id) {
            state.accountList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingAccount = null;
      })

      .addCase(deleteAccount.fulfilled, (state, action) => {
        const accountId = action.meta.arg;
        const deleteAccountIndex = state.accountList.findIndex(
          (account) => account.id === accountId
        );
        if (deleteAccountIndex !== -1) {
          state.accountList.splice(deleteAccountIndex, 1);
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

export const { startEditingAccount, cancelEditingAccount } =
  accountSlice.actions;
const accountReducer = accountSlice.reducer;
export default accountReducer;
