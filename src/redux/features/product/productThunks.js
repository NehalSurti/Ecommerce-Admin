import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest, userRequest } from "../../../utils/requestMethods";

export const getProductsAsync = createAsyncThunk(
  "product/getProducts",
  async () => {
    const response = await publicRequest.get("/products");
    return response.data;
  }
);

export const deleteProductAsync = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    const response = await userRequest.delete(`/products/${id}`);
    return id;
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productUpdate }) => {
    const response = await userRequest.patch(`/products/${id}`, productUpdate);
    return { id, product: response.data };
  }
);

export const addProductAsync = createAsyncThunk(
  "product/addProduct",
  async (product) => {
    const response = await userRequest.post(`/products`, product);
    return response.data;
  }
);
