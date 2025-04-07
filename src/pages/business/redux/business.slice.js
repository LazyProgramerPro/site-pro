import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessList: [],
  editingBusiness: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeBusinessList = [
  {
    id: 1,
    businessCode: "0100100020",
    businessName: "Công ty TNHH Xây dựng Minh Phát",
    key: "1"
  },
  {
    id: 2,
    businessCode: "0101245678",
    businessName: "Tập đoàn Vingroup",
    key: "2"
  },
  {
    id: 3,
    businessCode: "0102987654",
    businessName: "Tổng công ty Xây dựng Hà Nội",
    key: "3"
  },
  {
    id: 4, 
    businessCode: "0103456123",
    businessName: "Công ty CP Đầu tư Phát triển Đô thị",
    key: "4"
  },
  {
    id: 5,
    businessCode: "0104123987",
    businessName: "Tập đoàn Sunshine Group",
    key: "5"
  },
  {
    id: 6,
    businessCode: "0105789456",
    businessName: "Công ty TNHH Phát triển BĐS Tân Hoàng Minh",
    key: "6"
  },
  {
    id: 7,
    businessCode: "0106654321",
    businessName: "Công ty Xây dựng Hòa Bình",
    key: "7"
  },
  {
    id: 8,
    businessCode: "0107321654",
    businessName: "Tập đoàn Capital Land",
    key: "8"
  },
  {
    id: 9,
    businessCode: "0108987654",
    businessName: "Công ty TNHH Đầu tư LDG",
    key: "9"
  },
  {
    id: 10,
    businessCode: "0109876543",
    businessName: "Công ty Cổ phần Đầu tư Xây dựng Trung Nam",
    key: "10"
  },
  {
    id: 11,
    businessCode: "0110123456",
    businessName: "Công ty TNHH Xây dựng Thái Sơn",
    key: "11"
  },
  {
    id: 12,
    businessCode: "0111654321",
    businessName: "Tập đoàn Xây dựng Delta",
    key: "12"
  },
  {
    id: 13,
    businessCode: "0112789456",
    businessName: "Công ty CP Kiến trúc và Xây dựng Nam Tiến",
    key: "13"
  },
  {
    id: 14,
    businessCode: "0113456789",
    businessName: "Công ty TNHH Tư vấn Xây dựng An Phát",
    key: "14"
  },
  {
    id: 15,
    businessCode: "0114159263",
    businessName: "Tập đoàn Đầu tư và Phát triển Đô thị FLC",
    key: "15"
  },
  {
    id: 16,
    businessCode: "0115753951",
    businessName: "Công ty CP Xây dựng và Phát triển Hạ tầng Vĩnh Hưng",
    key: "16"
  },
  {
    id: 17,
    businessCode: "0116852147",
    businessName: "Tập đoàn Xây dựng Tecco",
    key: "17"
  },
  {
    id: 18,
    businessCode: "0117369258",
    businessName: "Công ty CP Tập đoàn Đầu tư Địa ốc Nova",
    key: "18"
  },
  {
    id: 19,
    businessCode: "0118258369",
    businessName: "Công ty TNHH Xây dựng và Phát triển Nhà Thủ Đức",
    key: "19"
  },
  {
    id: 20,
    businessCode: "0119147258",
    businessName: "Tập đoàn Sovico Holdings",
    key: "20"
  }
];

export const getBusinessList = createAsyncThunk(
  "business/getBusinessList",
  async (searchTerm, thunkAPI) => {
    console.log("getBusinessList with searchTerm:", searchTerm);

    if (!searchTerm) {
      return fakeBusinessList;
    }

    const filteredBusinesses = fakeBusinessList.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredBusinesses;
  }
);

export const addBusiness = createAsyncThunk(
  "business/addBusiness",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("businesses", body, {
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

export const updateBusiness = createAsyncThunk(
  "business/updateBusiness",
  async ({ businessId, body }, thunkAPI) => {
    try {
      const response = await http.put(`businesses/${businessId}`, body, {
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

export const deleteBusiness = createAsyncThunk(
  "business/deleteBusiness",
  async (businessId, thunkAPI) => {
    const response = await http.delete(`businesses/${businessId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    startEditingBusiness: (state, action) => {
      const businessId = action.payload;
      const foundBusiness =
        state.businessList.find((business) => business.id === businessId) || null;
      state.editingBusiness = foundBusiness;
    },
    cancelEditingBusiness: (state) => {
      state.editingBusiness = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBusinessList.fulfilled, (state, action) => {
        state.businessList = action.payload;
      })
      .addCase(addBusiness.fulfilled, (state, action) => {
        state.businessList.push(action.payload);
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.businessList.find((business, index) => {
          if (business.id === action.payload.id) {
            state.businessList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingBusiness = null;
      })

      .addCase(deleteBusiness.fulfilled, (state, action) => {
        const businessId = action.meta.arg;
        const deleteBusinessIndex = state.businessList.findIndex(
          (business) => business.id === businessId
        );
        if (deleteBusinessIndex !== -1) {
          state.businessList.splice(deleteBusinessIndex, 1);
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

export const { startEditingBusiness, cancelEditingBusiness } =
  businessSlice.actions;
const businessReducer = businessSlice.reducer;
export default businessReducer;
