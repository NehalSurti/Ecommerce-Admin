import { createSlice } from "@reduxjs/toolkit";
import { checkAuthAsync } from "./authThunks";

const initialState = {
  status: "idle",
  error: null,
  userChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthSlice: (state) => {
      state.userChecked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state) => {
        state.status = "idle";
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.status = "idle";
        state.userChecked = false;
      });
  },
});

export const { resetAuthSlice } = authSlice.actions;

export default authSlice.reducer;
