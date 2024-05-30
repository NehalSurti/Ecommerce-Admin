import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  order: orderReducer,
  auth: authReducer,
});

export default rootReducer;
