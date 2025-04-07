import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  acceptanceRequestList: [],
  editingAcceptanceRequest: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeAcceptanceRequestList = [
  {
    id: "1",
    name: "John Brown",
    description: "New York No. 1 Lake Park",
    price: 32,
    category: "New York No. 1 Lake Park",
    subCategory: "New York No. 1 Lake Park",
    quantity: 32,
  },
  {
    id: "2",
    name: "Jim Green",
    description: "London No. 1 Lake Park",
    price: 42,
    category: "London No. 1 Lake Park",
    subCategory: "London No. 1 Lake Park",
    quantity: 42,
  },
  // ... (rest of the data remains unchanged)
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
