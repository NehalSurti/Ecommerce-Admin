import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
});

export default rootReducer;
