const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const {
  getUploadSignature,
  uploadToCloudinary,
  saveDocumentMetadata,
  getMyDocuments,
  deleteDocument,
} = require("../../api/documentApi");

// Get Upload Signature
export const UploadSignature = createAsyncThunk(
  "document/uploadSignature",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await getUploadSignature(documentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Upload File to Cloudinary

export const UploadDocument = createAsyncThunk(
  "document/uploadDocument",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await uploadToCloudinary(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Save Metadata
export const SaveDocument = createAsyncThunk(
  "document/saveDocument",
  async (data, { rejectWithValue }) => {
    try {
      const response = await saveDocumentMetadata(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get My Documents

export const GetMyDocuments = createAsyncThunk(
  "document/getMyDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyDocuments();
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Document
export const DeleteDocument = createAsyncThunk(
  "document/deleteDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      await deleteDocument(documentId);
      return documentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const documentSlice = createSlice({
  name: "document",

  initialState: {
    documents: [],
    uploadSignature: null,
    uploadedFile: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ================= Upload Signature =================
      .addCase(UploadSignature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UploadSignature.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadSignature = action.payload;
      })
      .addCase(UploadSignature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ================= Upload Document =================
      .addCase(UploadDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(UploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFile = action.payload;
      })
      .addCase(UploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ================= Save Document =================
      .addCase(SaveDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(SaveDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
      })
      .addCase(SaveDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ================= Get Documents =================
      .addCase(GetMyDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetMyDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(GetMyDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ================= Delete Document =================
      .addCase(DeleteDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteDocument.fulfilled, (state, action) => {
        state.loading = false;

        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
      })
      .addCase(DeleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

module.exports = documentSlice.reducer;