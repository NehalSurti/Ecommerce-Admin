import { createAsyncThunk } from '@reduxjs/toolkit';
import { publicRequest } from "../../../utils/requestMethods";

export const loginAsync = createAsyncThunk(
    'user/login',
    async (user) => {
      const response = await publicRequest.post('/auth/login', user);
      return response.data;
    }
  );