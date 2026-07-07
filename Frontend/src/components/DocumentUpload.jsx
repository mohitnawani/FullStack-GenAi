import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  UploadSignature,
  SaveDocument,
  getMyDocuments,
  DocumentIngest,
  UploadDocument,
} from "../store/slices/documentSlice";
import useStatusPolling from "../../hooks/useStatusPolling";

const DocumentUpload = ({ onUploadSuccess }) => {
  const { startPolling } = useStatusPolling();
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
    const signatureData = await dispatch(
      UploadSignature(type)
    ).unwrap();

    // Step 2 — upload to Cloudinary
    const cloudinaryRes = await dispatch(
      UploadDocument({
        file,
        signatureData,
        onProgress: (percent) => setProgress(percent),
      })
    ).unwrap();

    // Step 3 — save metadata → get document back
    const savedDoc = await dispatch(
      SaveDocument({
        cloudinaryPublicId: cloudinaryRes.public_id,
        secureUrl: cloudinaryRes.secure_url,
        filename: file.name,
        resourceType: type,
        duration: cloudinaryRes.duration || null,
      })
    ).unwrap();

    // Step 4 — trigger ingestion but DON'T await ✅
    // runs in background — polling will track progress
    dispatch(DocumentIngest(cloudinaryRes.secure_url));

    // Step 5 — refresh list immediately
    await dispatch(getMyDocuments()).unwrap();

    // Step 6 — start polling for this document ✅
    startPolling(savedDoc._id);

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

  // ✅ changed UI — compact style to fit inside sidebar
  return (
    <div className="flex flex-col gap-2">

      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-input"
      />

      {/* upload button */}
      <label
        htmlFor="file-input"
        className={`
          flex items-center justify-center gap-2
          border border-dashed border-base-300
          rounded-lg p-3 cursor-pointer
          hover:bg-base-200 transition-colors
          ${uploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {uploading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <i className="ti ti-upload text-base-content/40" style={{ fontSize: 16 }} aria-hidden="true" />
        )}
        <div>
          <p className="text-xs text-base-content/60">
            {uploading ? "Uploading..." : "Upload PDF or Video"}
          </p>
          <p className="text-xs text-base-content/30">
            Max 10MB / 100MB
          </p>
        </div>
      </label>

      {/* progress bar */}
      {uploading && (
        <div>
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          />
          <p className="text-xs text-base-content/40 text-center">
            {progress}%
          </p>
        </div>
      )}

      {/* error */}
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}

      {/* success */}
      {success && (
        <p className="text-xs text-success">
          Uploaded! Indexing started...
        </p>
      )}

    </div>
  );
};

export default DocumentUpload;