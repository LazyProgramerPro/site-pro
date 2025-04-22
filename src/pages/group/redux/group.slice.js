import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupList: [],
  editingGroup: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeGroupList = [
  {
    id: '1',
    groupCode: 'G001',
    groupName: 'Nhóm Móng',
    category: 'Phần móng'
  },
  {
    id: '2',
    groupCode: 'G002',
    groupName: 'Nhóm Cốt thép',
    category: 'Phần kết cấu'
  },
  {
    id: '3',
    groupCode: 'G003',
    groupName: 'Nhóm Bê tông',
    category: 'Phần kết cấu'
  },
  {
    id: '4',
    groupCode: 'G004',
    groupName: 'Nhóm Điện',
    category: 'Hệ thống điện'
  },
  {
    id: '5',
    groupCode: 'G005',
    groupName: 'Nhóm Nước',
    category: 'Hệ thống nước'
  },
  {
    id: '6',
    groupCode: 'G006',
    groupName: 'Nhóm Hoàn thiện',
    category: 'Phần hoàn thiện'
  },
  {
    id: '7',
    groupCode: 'G007',
    groupName: 'Nhóm Xây gạch',
    category: 'Công tác xây gạch'
  },
  {
    id: '8',
    groupCode: 'G008',
    groupName: 'Nhóm Lắp kính',
    category: 'Công tác lắp kính'
  },
  {
    id: '9',
    groupCode: 'G009',
    groupName: 'Nhóm PCCC',
    category: 'Hệ thống PCCC'
  },
  {
    id: '10',
    groupCode: 'G010',
    groupName: 'Nhóm Điều hòa',
    category: 'Hệ thống điều hòa'
  },
  {
    id: '11',
    groupCode: 'G011',
    groupName: 'Nhóm Sơn',
    category: 'Công tác sơn'
  },
  {
    id: '12',
    groupCode: 'G012',
    groupName: 'Nhóm Lát sàn',
    category: 'Công tác lát sàn'
  },
  {
    id: '13',
    groupCode: 'G013',
    groupName: 'Nhóm Cấp thoát nước',
    category: 'Hệ thống cấp thoát nước'
  },
  {
    id: '14',
    groupCode: 'G014',
    groupName: 'Nhóm Thông tin',
    category: 'Hệ thống thông tin liên lạc'
  },
  {
    id: '15',
    groupCode: 'G015',
    groupName: 'Nhóm Đường',
    category: 'Công tác mặt đường'
  },
  {
    id: '16',
    groupCode: 'G016',
    groupName: 'Nhóm Thạch cao',
    category: 'Trần thạch cao'
  },
  {
    id: '17',
    groupCode: 'G017',
    groupName: 'Nhóm Cửa',
    category: 'Lắp đặt cửa'
  },
  {
    id: '18',
    groupCode: 'G018',
    groupName: 'Nhóm Vật liệu',
    category: 'Quản lý vật liệu'
  }
];



export const getGroupList = createAsyncThunk(
  "group/getGroupList",
  async (searchTerm, thunkAPI) => {
    console.log("getGroupList with searchTerm:", searchTerm);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (!searchTerm) {
      return fakeGroupList;
    }

    const filteredGroups = fakeGroupList.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredGroups;
  }
);

export const addGroup = createAsyncThunk(
  "group/addGroup",
  async (body, thunkAPI) => {
    try {
      const response = await http.post("groups", body, {
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

export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async ({ groupId, body }, thunkAPI) => {
    try {
      const response = await http.put(`groups/${groupId}`, body, {
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

export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (groupId, thunkAPI) => {
    const response = await http.delete(`groups/${groupId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
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
  },
  extraReducers(builder) {
    builder
      .addCase(getGroupList.fulfilled, (state, action) => {
        state.groupList = action.payload;
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
