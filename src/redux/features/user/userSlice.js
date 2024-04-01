import { createSlice } from "@reduxjs/toolkit";
import { loginAsync } from "./userThunks";

const initialState = {
  currentUser: null,
  isFetching: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentUser = action.payload;
        state.error = false;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const selectuser = (state) => state.user.currentUser;

export default userSlice.reducer;
