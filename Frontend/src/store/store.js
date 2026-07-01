import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import documentReducer from "./slices/documentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
  },
});

export default store;
