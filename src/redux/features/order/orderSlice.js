import { createSlice } from "@reduxjs/toolkit";
import {
  getOrdersAsync,
  getUserOrdersAsync,
  deleteOrderAsync,
  updateOrderAsync,
  addOrderAsync,
  getMonthlyIncomeAsync,
} from "./orderThunks";

const initialState = {
  orders: [],
  isFetching: false,
  error: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deleteOrderAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders.splice(
          state.orders.findIndex((item) => item._id === action.payload),
          1
        );
      })
      .addCase(deleteOrderAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders[
          state.orders.findIndex((item) => item._id === action.payload.id)
        ] = action.payload.order;
      })
      .addCase(updateOrderAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(addOrderAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders.push(action.payload);
      })
      .addCase(addOrderAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(getUserOrdersAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getUserOrdersAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrdersAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(getMonthlyIncomeAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getMonthlyIncomeAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload;
      })
      .addCase(getMonthlyIncomeAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export default orderSlice.reducer;
