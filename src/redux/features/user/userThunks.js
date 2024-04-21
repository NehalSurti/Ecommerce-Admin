import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest, userRequest } from "../../../utils/requestMethods";

export const registerAsync = createAsyncThunk("user/register", async (user) => {
  const response = await publicRequest.post("/auth/register", user);
  return response.data ? true : false;
});

export const loginAsync = createAsyncThunk("user/login", async (user) => {
  const response = await publicRequest.post("/auth/login", user);
  return response.data;
});

export const getAllUsersAsync = createAsyncThunk(
  "user/getAllUsers",
  async (queryParam = false) => {
    let url = "/users";
    if (queryParam) {
      url += "?new=true";
    }
    const response = await userRequest.get(url);
    return response.data;
  }
);

export const getUserAsync = createAsyncThunk("user/getUser", async (id) => {
  const response = await userRequest.get(`/users/find/${id}`);
  return response.data;
});

export const deleteUserAsync = createAsyncThunk(
  "user/deleteUser",
  async (id) => {
    const response = await userRequest.delete(`/users/${id}`);
    return id;
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async ({ id, userUpdate }) => {
    const response = await userRequest.patch(`/users/${id}`, userUpdate);
    return { id, user: response.data };
  }
);

export const getUserStatsAsync = createAsyncThunk(
  "user/getUserStats",
  async () => {
    const response = await userRequest.get(`/users/stats`);
    return response.data;
  }
);

export const verifyTokenAsync = createAsyncThunk("user/verifyToken", async () => {
  const response = await userRequest.get("/auth/tokenVerify");
  return response.data;
});