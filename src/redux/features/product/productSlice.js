import { createSlice } from "@reduxjs/toolkit";
import {
  getProductsAsync,
  deleteProductAsync,
  updateProductAsync,
  addProductAsync,
} from "./productThunks";

const initialState = {
  products: [],
  isFetching: false,
  error: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = action.payload;
      })
      .addCase(getProductsAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products.splice(
          state.products.findIndex((item) => item._id === action.payload),
          1
        );
      })
      .addCase(deleteProductAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products[
          state.products.findIndex((item) => item._id === action.payload.id)
        ] = action.payload.product;
      })
      .addCase(updateProductAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(addProductAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products.push(action.payload);
      })
      .addCase(addProductAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export default productSlice.reducer;
