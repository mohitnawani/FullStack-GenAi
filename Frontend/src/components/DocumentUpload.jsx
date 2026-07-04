import { useRef, useState } from "react";
import  { useDispatch } from "react-redux";
import  {
  UploadSignature,
  SaveDocument,
  getMyDocuments,
  DeleteDocument,
  DocumentIngest,
  UploadDocument,
  
} from "../store/slices/documentSlice" ;

const DocumentUpload = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isPDF = file.type === "application/pdf";
    const isVideo = file.type.startsWith("video/");
    if (!isPDF && !isVideo) {
      setError("Only PDF or video files allowed");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      setSuccess(false);

      const type = isPDF ? "pdf" : "video";

      // Step 1 — get signature
      console.log("Step 1: Getting upload signature...");
      const signatureData = await dispatch(
        UploadSignature(type)
      ).unwrap();
      console.log("Signature received:", signatureData);

      // Step 2 — upload to Cloudinary directly (needs progress callback)
      console.log("Step 2: Uploading to Cloudinary...");
      const cloudinaryRes = await dispatch(
        UploadDocument({
          file,
          signatureData,
          onProgress: (percent) => setProgress(percent)
        })
      ).unwrap();
      console.log("Cloudinary response:", cloudinaryRes);

      // Step 3 — save metadata to backend
      console.log("Step 3: Saving metadata...");
      await dispatch(
        SaveDocument({
          cloudinaryPublicId: cloudinaryRes.public_id,
          secureUrl: cloudinaryRes.secure_url,
          filename: file.name,
          resourceType: type,
          duration: cloudinaryRes.duration || null,
        })
      ).unwrap();

      console.log("Step 4: start injesting document...");
      // Step 4 — ingest document
      const ingestResult = await dispatch(DocumentIngest(cloudinaryRes.secure_url)).unwrap();
      console.log("Ingest result:", ingestResult);

      // Step 5 — refresh document list
      console.log("Step 5: Refreshing document list...");
      const myDocuments = await dispatch(getMyDocuments()).unwrap();
      console.log("My documents:", myDocuments);

      setProgress(100);
      setSuccess(true);
      onUploadSuccess?.();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error("Upload failed:", err);
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-base-300 rounded-xl text-center">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-input"
      />

      <label
        htmlFor="file-input"
        className={`btn btn-primary ${uploading ? "btn-disabled" : ""}`}
      >
        {uploading ? "Uploading..." : "Upload PDF or Video"}
      </label>

      {uploading && (
        <div className="mt-4">
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          />
          <p className="text-sm text-base-content/60 mt-1">{progress}%</p>
        </div>
      )}

      {error && (
        <p className="text-error text-sm mt-3">{error}</p>
      )}

      {success && (
        <p className="text-success text-sm mt-3">
          Upload successful! Indexing started...
        </p>
      )}

      <p className="text-xs text-base-content/40 mt-3">
        PDF (max 10MB) or Video (max 100MB)
      </p>
    </div>
  );
};

export default DocumentUpload;