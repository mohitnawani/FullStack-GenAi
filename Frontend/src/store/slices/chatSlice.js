const  { createAsyncThunk, createSlice } = require('@reduxjs/toolkit');
const axiosClient= require('../../utils/axiosclient');
const { askQuestion, getChatHistory, clearChatHistory, getDocumentStatus } = require('../../api/chatApi')


export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",          // ← fix name, not "auth"
  async (documentId, { rejectWithValue }) => {  // ← documentId not userData
    try {
      const response = await getChatHistory(documentId);  // ← chatApi call
      return response.response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);