import { useState } from "react";
import axiosClient from "../utils/axiosclient";
import {
  getUploadSignature,
  uploadToCloudinary,
  saveDocumentMetadata,
  getMyDocuments 
} from "../api/documentApi";

const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadDocument = async (file) => {
    try {
      console.log("Starting upload for file:", file.name);
      setUploading(true);
      setError(null);
      setProgress(0);

      // detect type
      const type = file.type === "application/pdf" ? "pdf" : "video";

      // Step 1 — get signature
      const signatureData = await getUploadSignature(type);

      // Step 2 — upload to Cloudinary
      const cloudinaryRes = await uploadToCloudinary(
        file,
        signatureData,
        (percent) => setProgress(percent)
      );
      console.log("Cloudinary Response:", cloudinaryRes);

      // Step 3 — save metadata to backend
      await saveDocumentMetadata({
        cloudinaryPublicId: cloudinaryRes.public_id,
        secureUrl: cloudinaryRes.secure_url,
        filename: file.name,
        resourceType: type,
        duration: cloudinaryRes.duration || null,
      });

      console.log(cloudinaryRes.secure_url)

      const getDocuments= await getMyDocuments (cloudinaryRes.secure_url);

      setProgress(100);
      return { success: true };

    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed");
      return { success: false };
    } finally {
      setUploading(false);
    }
  };

  return { uploadDocument, uploading, progress, error };
};

export default useDocumentUpload;