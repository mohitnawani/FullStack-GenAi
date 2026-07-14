import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import documentReducer from "./slices/documentSlice";
import chat from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
    chat: chat,
  },
});

export default store;
