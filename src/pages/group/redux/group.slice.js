import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  groupList: [],
  totalCount: 0,
  editingGroup: null,
  loading: false,
  currentRequestId: undefined,
};

export const getGroupList = createAsyncThunk(
  "group/getGroupList",
  async (filters, thunkAPI) => {
    const { rc, data, totalCount } = await http.post(
      "/auth/nhomhangmuc/list",
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

export const addGroup = createAsyncThunk(
  "group/addGroup",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.post("/auth/nhomhangmuc/add", body, {
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

export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async (body, thunkAPI) => {
    try {
      const { rc, item } = await http.put("/auth/nhomhangmuc/update", body, {
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

export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (groupId, thunkAPI) => {
    try {
      const { rc } = await http.delete("/auth/nhomhangmuc", {
        data: { id: groupId },
        signal: thunkAPI.signal,
      });
      if (!rc || rc.code !== 0) {
        message.error(rc?.desc || "Lỗi không xác định!");
        return thunkAPI.rejectWithValue(rc?.desc || "Lỗi không xác định!");
      }
      return groupId;
    } catch (error) {
      message.error("Xóa nhóm hạng mục thất bại!");
      return thunkAPI.rejectWithValue("Xóa nhóm hạng mục thất bại!");
    }
  }
);

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    startEditingGroup: (state, action) => {
      const groupId = action.payload;
      const foundGroup =
        state.groupList.find((group) => group.id === groupId) || null;
      state.editingGroup = foundGroup;
    },
    cancelEditingGroup: (state) => {
      state.editingGroup = null;
    },
  },  extraReducers(builder) {
    builder
      .addCase(getGroupList.fulfilled, (state, action) => {
        state.groupList = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.groupList.push(action.payload);
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.groupList.find((group, index) => {
          if (group.id === action.payload.id) {
            state.groupList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingGroup = null;
      })

      .addCase(deleteGroup.fulfilled, (state, action) => {
        const groupId = action.meta.arg;
        const deleteGroupIndex = state.groupList.findIndex(
          (group) => group.id === groupId
        );
        if (deleteGroupIndex !== -1) {
          state.groupList.splice(deleteGroupIndex, 1);
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

export const { startEditingGroup, cancelEditingGroup } = groupSlice.actions;
const groupReducer = groupSlice.reducer;
export default groupReducer;
