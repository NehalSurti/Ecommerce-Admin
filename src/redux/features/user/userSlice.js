import { createSlice } from "@reduxjs/toolkit";
import {
  registerAsync,
  loginAsync,
  getAllUsersAsync,
  getUserAsync,
  deleteUserAsync,
  updateUserAsync,
  getUserStatsAsync,
} from "./userThunks";

const initialState = {
  users: [],
  currentUser: null,
  fetchedUser: null,
  userStats: [],
  isFetching: false,
  error: false,
  registerNewUser: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.registerNewUser = action.payload;
        state.error = false;
      })
      .addCase(registerAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
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
      })
      .addCase(getAllUsersAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users = action.payload;
      })
      .addCase(getAllUsersAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(getUserAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.fetchedUser = action.payload;
      })
      .addCase(getUserAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users.splice(
          state.users.findIndex((item) => item._id === action.payload),
          1
        );
      })
      .addCase(deleteUserAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users[
          state.users.findIndex((item) => item._id === action.payload.id)
        ] = action.payload.user;
      })
      .addCase(updateUserAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(getUserStatsAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getUserStatsAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userStats = action.payload;
      })
      .addCase(getUserStatsAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const selectuser = (state) => state.user.currentUser;

export default userSlice.reducer;
