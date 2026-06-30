const  { createAsyncThunk, createSlice } = require('@reduxjs/toolkit');
const { askQuestion, getChatHistory, clearChatHistory, getDocumentStatus } = require('../../api/chatApi')


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
        state.messages = action.payload;  // load all previous messages
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
        // push both user question and AI answer to messages
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
        state.messages = [];  // empty messages on UI
      })
      .addCase(clearChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(DocumentStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DocumentStatus.fulfilled, (state) => {
        state.isLoading = false;
        state.messages = [];  // empty messages on UI
      })
     .addCase(DocumentStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.documentStatus = action.payload.status; // 
     })
      
  },
});

export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;
