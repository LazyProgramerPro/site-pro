import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessList: [],
  totalCount: 0,
  editingBusiness: null,
  loading: false,
  currentRequestId: undefined,
};



export const getBusinessList = createAsyncThunk(
  "business/getBusinessList",
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post('/auth/company/list', { ...filters });

    if (rc?.code !== 0) {
      message.error(rc?.desc || 'Lỗi không xác định!');
      return thunkAPI.rejectWithValue(rc?.desc || 'Lỗi không xác định!');
    }
  
    return { data, totalCount };
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
        state.businessList = action.payload.data;
        state.totalCount = action.payload.totalCount;
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
