import axiosClient from "../utils/axiosclient";
import axios from "axios";

// Step 1 — get signature from backend
export const getUploadSignature = async (type) => {
  const res = await axiosClient.get(
    `/api/documents/upload-signature?type=${type}`,
    { withCredentials: true },
  );
  return res.data;
};

// Step 2 — upload file directly to Cloudinary
export const uploadToCloudinary = async (file, signatureData, onProgress) => {
  try {
    console.log("Uploading file:", file);
    const { signature, timestamp, public_id, api_key, cloud_name, upload_url } =
      signatureData;

    console.log("Uploading to Cloudinary with signature data:", signatureData);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("public_id", public_id);
    console.log("FormData prepared for Cloudinary upload:", formData);

    const res = await axios.post(upload_url, formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        if (onProgress) {
          onProgress(percent);
        }
      },
    });

    return res.data;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

// Step 3 — save metadata to backend
export const saveDocumentMetadata = async (payload) => {
  const res = await axiosClient.post(`/api/documents/save`, payload, {
    withCredentials: true,
  });
  return res.data;
};

// Ingest document
export const DocumentIngest = async (cloudinaryUrl) => {
  const res = await axiosClient.post(
    `/api/documents/ingest`,
    {
      cloudinaryUrl, // ← send it in the request body
    },
    {
      withCredentials: true, // ← options go as 3rd argument
    },
  );
  return res.data;
};

// delete document
export const deleteDocument = async (id) => {
  console.log("Deleting document with ID:", id);
  const res = await axiosClient.delete(`/api/documents/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getMyDocuments = async () => {
  const res = await axiosClient.get(`/api/documents/my-documents`, {
    withCredentials: true,
  });
  return res.data;
};
