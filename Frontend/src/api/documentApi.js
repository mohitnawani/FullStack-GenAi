import axiosClient from "../utils/axiosclient";
// Step 1 — get signature from backend
export const getUploadSignature = async (type) => {
  const res = await axiosClient.get(
    `/api/documents/upload-signature?type=${type}`,
    { withCredentials: true }
  );
  return res.data;
};

// Step 2 — upload file directly to Cloudinary
export const uploadToCloudinary = async (file, signatureData, onProgress) => {
  const { signature, timestamp, public_id, api_key, cloud_name, upload_url } =
    signatureData;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("public_id", public_id);

  const res = await axiosClient.post(upload_url, formData, {
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (onProgress) onProgress(percent); // for progress bar
    },
  });

  return res.data; // { secure_url, public_id, duration, ... }
};

// Step 3 — save metadata to backend
export const saveDocumentMetadata = async (payload) => {
  const res = await axiosClient.post(
    `/api/documents/save`,
    payload,
    { withCredentials: true }
  );
  return res.data;
};

// get all documents
export const getMyDocuments = async () => {
  const res = await axiosClient.get(`/api/documents`, {
    withCredentials: true,
  });
  return res.data;
};

// delete document
export const deleteDocument = async (id) => {
  const res = await axiosClient.delete(`/api/documents/${id}`, {
    withCredentials: true,
  });
  return res.data;
};