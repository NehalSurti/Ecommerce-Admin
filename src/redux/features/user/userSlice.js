import { createSlice } from "@reduxjs/toolkit";
import {
  registerAsync,
  loginAsync,
  getAllUsersAsync,
  getUserAsync,
  deleteUserAsync,
  updateUserAsync,
  getUserStatsAsync,
  verifyTokenAsync,
} from "./userThunks";

const initialState = {
  users: [],
  currentUser: null,
  fetchedUser: null,
  userStats: [],
  isFetching: false,
  error: false,
  registerNewUser: false,
  registerError: false,
  loginError: false,
  getAllUsersError: false,
  updateError: false,
  getUserError: false,
  deleteUserError: false,
  getUserStatsError: false,
  verifiedToken: false,
  verifiedTokenError: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("persist:admin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isFetching = true;
        state.registerError = false;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.registerNewUser = action.payload;
        state.registerError = false;
      })
      .addCase(registerAsync.rejected, (state) => {
        state.isFetching = false;
        state.registerError = true;
      })
      .addCase(loginAsync.pending, (state) => {
        state.isFetching = true;
        state.loginError = false;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentUser = action.payload;
        state.loginError = false;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isFetching = false;
        state.loginError = true;
      })
      .addCase(getAllUsersAsync.pending, (state) => {
        state.isFetching = true;
        state.getAllUsersError = false;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users = action.payload;
        state.getAllUsersError = false;
      })
      .addCase(getAllUsersAsync.rejected, (state) => {
        state.isFetching = false;
        state.getAllUsersError = true;
      })
      .addCase(getUserAsync.pending, (state) => {
        state.isFetching = true;
        state.getUserError = false;
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.fetchedUser = action.payload;
        state.getUserError = false;
      })
      .addCase(getUserAsync.rejected, (state) => {
        state.isFetching = false;
        state.getUserError = true;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.isFetching = true;
        state.deleteUserError = false;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users.splice(
          state.users.findIndex((item) => item._id === action.payload),
          1
        );
        state.deleteUserError = false;
      })
      .addCase(deleteUserAsync.rejected, (state) => {
        state.isFetching = false;
        state.deleteUserError = true;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.isFetching = true;
        state.updateError = false;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.users[
          state.users.findIndex((item) => item._id === action.payload.id)
        ] = action.payload.user;
      })
      .addCase(updateUserAsync.rejected, (state) => {
        state.isFetching = false;
        state.updateError = true;
      })
      .addCase(getUserStatsAsync.pending, (state) => {
        state.isFetching = true;
        state.getUserStatsError = false;
      })
      .addCase(getUserStatsAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userStats = action.payload;
        state.getUserStatsError = false;
      })
      .addCase(getUserStatsAsync.rejected, (state) => {
        state.isFetching = false;
        state.getUserStatsError = true;
      })
      .addCase(verifyTokenAsync.pending, (state) => {
        state.isFetching = true;
        state.verifiedTokenError = false;
      })
      .addCase(verifyTokenAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.verifiedToken = true;
        state.verifiedTokenError = false;
      })
      .addCase(verifyTokenAsync.rejected, (state) => {
        state.isFetching = false;
        state.verifiedTokenError = true;
      });
  },
});

export const selectuser = (state) => state.user.currentUser;

export const { logout} = userSlice.actions;

export default userSlice.reducer;
