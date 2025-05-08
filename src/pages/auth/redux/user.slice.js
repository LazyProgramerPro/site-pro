
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loggedInUser: (state, action) => {
      state.user = action.payload;
    },

    logOut: (state, action) => {
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder.addDefaultCase((state, action) => {
      // console.log(`action type: ${action.type}`, current(state))
    });
  },
});

export const { loggedInUser, logOut } = userSlice.actions;
const userReducer = userSlice.reducer;

export default userReducer;
