import  { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import   { askQuestion, getChatHistory, clearChatHistory, getDocumentStatus } from '../../api/chatApi'


// ── THUNKS ──
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await getChatHistory(documentId);
      return response.messages;  // ✅ correct key
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendQuestion = createAsyncThunk(
  "chat/sendQuestion",
  async ({ question, documentId }, { rejectWithValue }) => {  // ✅ destructured
    try {
      const response = await askQuestion(question, documentId);
      return response.response;  // { question, answer }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearChat = createAsyncThunk(
  "chat/clearChat",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await clearChatHistory(documentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const DocumentStatus = createAsyncThunk(
  "chat/DocumentStatus",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await  getDocumentStatus(documentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ── SLICE ──

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  documentStatus: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // reset chat when user switches document
    resetChat: (state) => {
      state.messages = [];
      state.error = null;
      state.isLoading = false;
    },
  },
extraReducers: (builder) => {
  builder
    // ── fetchChatHistory ──
    .addCase(fetchChatHistory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchChatHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    })
    .addCase(fetchChatHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // ── sendQuestion ──
    .addCase(sendQuestion.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(sendQuestion.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages.push(
        { role: "user",      content: action.payload.question },
        { role: "assistant", content: action.payload.answer }
      );
    })
    .addCase(sendQuestion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // ── clearChat ──
    .addCase(clearChat.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(clearChat.fulfilled, (state) => {
      state.isLoading = false;
      state.messages = [];
    })
    .addCase(clearChat.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // ── DocumentStatus ──
    .addCase(DocumentStatus.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(DocumentStatus.fulfilled, (state, action) => {  // ✅ only one
      state.isLoading = false;
      state.documentStatus = action.payload.status;
    })
    .addCase(DocumentStatus.rejected, (state, action) => {   // ✅ added
      state.isLoading = false;
      state.error = action.payload;
    });
},

});

export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;
