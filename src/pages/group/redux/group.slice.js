import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupList: [],
  editingGroup: null,
  loading: false,
  currentRequestId: undefined,
};

const fakeGroupList = [
  // Keep your example data
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

  {
    id: "3",
    name: "Joe Black",
    description: "Sydney No. 1 Lake Park",
    price: 32,
    category: "Sydney No. 1 Lake Park",
    subCategory: "Sydney No. 1 Lake Park",
    quantity: 32,
  },
  // ... (rest of the data remains unchanged)
];

export const getGroupList = createAsyncThunk(
  "group/getGroupList",
  async (searchTerm, thunkAPI) => {
    console.log("getGroupList with searchTerm:", searchTerm);

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
