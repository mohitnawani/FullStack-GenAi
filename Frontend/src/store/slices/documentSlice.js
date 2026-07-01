import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getUploadSignature,
  uploadToCloudinary,
  saveDocumentMetadata,
  DocumentIngest as documentIngestApi,
  deleteDocument,
  getMyDocuments as getMyDocumentsApi,
} from "../../api/documentApi";

// Get Upload Signature
export const UploadSignature = createAsyncThunk(
  "document/uploadSignature",
  async (type, { rejectWithValue }) => {
    try {
      const response = await getUploadSignature(type);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Upload File to Cloudinary
export const UploadDocument = createAsyncThunk(
  "document/uploadDocument",
  async ({ file, signatureData, onProgress }, { rejectWithValue }) => {
    try {
      const response = await uploadToCloudinary(file, signatureData, onProgress);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Save Metadata
export const SaveDocument = createAsyncThunk(
  "document/saveDocument",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await saveDocumentMetadata(payload);
      return response.document; // ✅ return just the document
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Ingest Document
export const DocumentIngest = createAsyncThunk(
  "document/documentIngest",
  async (cloudinaryUrl, { rejectWithValue }) => {
    try {
      const response = await documentIngestApi(cloudinaryUrl);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Document
export const DeleteDocument = createAsyncThunk(
  "document/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDocument(id);
      return id; // ✅ return id to filter from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get My Documents
export const getMyDocuments = createAsyncThunk(
  "document/getMyDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyDocumentsApi();
      return response.documents; // ✅ return just the array
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
        state.documents.push(action.payload); // ✅ pushes just the document
      })
      .addCase(SaveDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Ingest Document =================
      .addCase(DocumentIngest.pending, (state) => {
        state.loading = true;
      })
      .addCase(DocumentIngest.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(DocumentIngest.rejected, (state, action) => {
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
      })

      // ================= Get My Documents =================
      .addCase(getMyDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload; // ✅ array directly
      })
      .addCase(getMyDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default documentSlice.reducer;