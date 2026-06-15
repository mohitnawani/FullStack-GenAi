import { useRef } from "react";
import { useState } from "react";
import useDocumentUpload from "../hooks/useDocumentUpload";

const DocumentUpload = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [result, setResult] = useState("false");
  const { uploadDocument, uploading, progress, error } = useDocumentUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validate — only PDF or video
    const isPDF = file.type === "application/pdf";
    const isVideo = file.type.startsWith("video/");

    if (!isPDF && !isVideo) {
      alert("Only PDF or video files allowed");
      return;
    }

    const result = await uploadDocument(file);
    if (result.success) {
        setResult("true");
      onUploadSuccess?.();               // refresh document list
      fileInputRef.current.value = "";   // reset input
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

      {/* progress bar */}
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

      {/* error */}
      {error && (
        <p className="text-error text-sm mt-3">{error}</p>
      )}

      <p className="text-xs text-base-content/40 mt-3">
        PDF (max 10MB) or Video (max 100MB)
      </p>
      {result === "true" && (<p className="text-success text-sm mt-3">Upload successful!</p>)}
    </div>
  );
};

export default DocumentUpload;