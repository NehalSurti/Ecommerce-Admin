import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../../utils/requestMethods";

export const getOrdersAsync = createAsyncThunk("order/getOrders", async () => {
  const response = await userRequest.get("/orders");
  return response.data;
});

export const getUserOrdersAsync = createAsyncThunk(
  "order/getUserOrders",
  async (userId) => {
    const response = await userRequest.get(`/orders/find/${userId}`);
    return response.data;
  }
);

export const deleteOrderAsync = createAsyncThunk(
  "order/deleteOrder",
  async (id) => {
    const response = await userRequest.delete(`/orders/${id}`);
    return id;
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async ({ id, orderUpdate }) => {
    const response = await userRequest.patch(`/orders/${id}`, orderUpdate);
    return { id, order: response.data };
  }
);

export const addOrderAsync = createAsyncThunk(
  "order/addOrder",
  async (order) => {
    const response = await userRequest.post(`/orders`, order);
    return response.data;
  }
);

export const getMonthlyIncomeAsync = createAsyncThunk(
  "order/getMonthlyIncome",
  async () => {
    const response = await userRequest.get(`/orders/income`);
    return response.data;
  }
);

export const getMonthlyIncomeforProductAsync = createAsyncThunk(
  "order/getMonthlyIncomeforProduct",
  async (id) => {
    const response = await userRequest.get(`/orders/income/${id}`);
    return response.data;
  }
);
