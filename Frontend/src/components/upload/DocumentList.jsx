import { useEffect, useState } from "react";
import { getMyDocuments, deleteDocument } from "../../api/documentApi";

const DocumentList = ({ refresh }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, [refresh]);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await getMyDocuments();
      setDocs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(id);
    fetchDocs();
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!docs.length)
    return (
      <p className="text-center mt-8 text-base-content/50">No documents yet</p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {docs.map((doc) => (
        <div key={doc._id} className="card bg-base-200 shadow">
          <div className="card-body p-4">
            {/* thumbnail for video */}
            {doc.resourceType === "video" && doc.thumbnailUrl && (
              <img
                src={doc.thumbnailUrl}
                alt={doc.filename}
                className="rounded-lg w-full object-cover h-36"
              />
            )}

            {/* PDF icon */}
            {doc.resourceType === "pdf" && (
              <div className="bg-error/10 text-error rounded-lg h-16 flex items-center justify-center text-2xl font-bold">
                PDF
              </div>
            )}

            <h3 className="font-semibold text-sm mt-2 truncate">
              {doc.filename}
            </h3>

            <div className="flex items-center justify-between mt-2">
              <span
                className={`badge badge-sm ${
                  doc.status === "processed"
                    ? "badge-success"
                    : doc.status === "failed"
                      ? "badge-error"
                      : "badge-warning"
                }`}
              >
                {doc.status}
              </span>

              <button
                onClick={() => handleDelete(doc._id)}
                className="btn btn-ghost btn-xs text-error"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
