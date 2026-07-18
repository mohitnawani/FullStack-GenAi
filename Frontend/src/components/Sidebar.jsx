import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyDocuments, DeleteDocument } from "../store/slices/documentSlice";
import DocumentUpload from "./DocumentUpload";

const Sidebar = ({ activeDocumentId, onSelectDocument, onDeleteDocument, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.document);

  // load documents when sidebar mounts
  useEffect(() => {
    dispatch(getMyDocuments());
  }, [dispatch]);

  // ✅ auto refresh when any document is still processing
  useEffect(() => {
    const hasProcessingDocs = documents.some(
      (doc) => doc.status === "pending" || doc.status === "processing"
    );

    if (!hasProcessingDocs) return; // no need to poll

    const interval = setInterval(() => {
      dispatch(getMyDocuments());
    }, 4000); // every 4 seconds

    return () => clearInterval(interval); // cleanup
  }, [documents, dispatch]);

  const handleDelete = async (e, docId) => {
    e.stopPropagation();
    dispatch(DeleteDocument(docId));
    onDeleteDocument?.(docId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":  return "text-success";
      case "processing": return "text-warning";
      case "pending":    return "text-warning";
      case "failed":     return "text-error";
      default:           return "text-base-content/40";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "processed":  return "Ready";
      case "processing": return "Indexing...";
      case "pending":    return "Pending...";
      case "failed":     return "Failed";
      default:           return "Unknown";
    }
  };

  const getFileIcon = (resourceType) => {
    return resourceType === "video"
      ? "ti ti-video"
      : "ti ti-file-type-pdf";
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close documents panel"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/55 transition-opacity md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[min(86vw,20rem)] flex-col border-r border-base-300 bg-base-200 shadow-2xl transition-transform duration-200 md:static md:h-full md:w-60 md:translate-x-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* header */}
      <div className="flex items-center justify-between p-3 border-b border-base-300">
        <div>
          <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium">My Documents</p>
          <p className="text-sm font-semibold text-base-content mt-0.5">EduMind AI</p>
        </div>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-xs btn-circle md:hidden" aria-label="Close documents">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* document list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {loading && documents.length === 0 && (
          <p className="text-xs text-base-content/40 text-center mt-4">
            Loading...
          </p>
        )}

        {!loading && documents.length === 0 && (
          <p className="text-xs text-base-content/40 text-center mt-4">
            No documents yet
          </p>
        )}

        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => {
              if (doc.status === "processed") {
                onSelectDocument(doc);
                onClose?.();
              }
            }}
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer group
              transition-colors duration-150
              ${activeDocumentId === doc._id
                ? "bg-base-300 border border-base-300"
                : "hover:bg-base-300"
              }
              ${doc.status !== "processed" ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {/* file icon */}
            <i
              className={`${getFileIcon(doc.resourceType)} text-base-content/60`}
              style={{ fontSize: 15 }}
              aria-hidden="true"
            />

            {/* name + status */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content truncate">
                {doc.filename}
              </p>
              <p className={`text-xs ${getStatusColor(doc.status)}`}>
                {getStatusText(doc.status)}
                {doc.resourceType === "pdf" && doc.pageCount
                  ? ` · ${doc.pageCount}p`
                  : ""}
              </p>
            </div>

            {/* delete button */}
            <button
              type="button"
              onClick={(e) => handleDelete(e, doc._id)}
              className="p-1 rounded text-error hover:bg-error/20
                         transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label={`Delete ${doc.filename}`}
              title="Delete"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M6 6l1 15h10l1-15" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* upload at bottom */}
      <div className="p-2 border-t border-base-300">
        <DocumentUpload
          onUploadSuccess={() => dispatch(getMyDocuments())}
        />
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
