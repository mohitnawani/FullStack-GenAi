// pages/DashboardPage.jsx
import { logoutUser } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { resetChat, fetchChatHistory } from "../store/slices/chatSlice";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documentId } = useParams();
  const { documents } = useSelector((state) => state.document);
  const [activeDocument, setActiveDocument] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectDocument = (doc) => {
    // reset chat when switching documents
    dispatch(resetChat());
    setActiveDocument(doc);
    navigate(`/dashboard/${doc._id}`);
    setIsSidebarOpen(false);
    // load chat history for selected document
    dispatch(fetchChatHistory(doc._id));
  };

  const handleDeleteDocument = (docId) => {
    if (activeDocument?._id !== docId) return;

    setActiveDocument(null);
    dispatch(resetChat());
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    if (!documentId) {
      if (activeDocument) {
        setActiveDocument(null);
        dispatch(resetChat());
      }
      return;
    }

    if (documents.length === 0) return;

    const doc = documents.find((item) => item._id === documentId);

    if (!doc || doc.status !== "processed") {
      setActiveDocument(null);
      dispatch(resetChat());
      navigate("/dashboard", { replace: true });
      return;
    }

    if (activeDocument?._id === doc._id) return;

    setActiveDocument(doc);
    dispatch(fetchChatHistory(doc._id));
  }, [activeDocument?._id, dispatch, documentId, documents, navigate]);

  return (
    <div className="flex h-[100dvh] bg-base-100 overflow-hidden">

      {/* LEFT — sidebar */}
      <Sidebar
        activeDocumentId={activeDocument?._id}
        onSelectDocument={handleSelectDocument}
        onDeleteDocument={handleDeleteDocument}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* RIGHT — main chat area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* no document selected */}
        {!activeDocument ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="btn btn-ghost btn-xs md:hidden absolute left-3 top-3"
              aria-label="Open documents"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
              <i
                className="ti ti-message-dots text-base-content/30"
                style={{ fontSize: 22 }}
                aria-hidden="true"
              />
            </div>

            <button
                onClick={() => dispatch(logoutUser())}
                className="text-xs text-white hover:text-base-content/60
                           border border-bs-base-content rounded px-2 py-1
                           hover:bg-base-200 transition-colors"
              >
                Logout
            </button>



            
            <div>
              <p className="text-base font-medium text-base-content/70">
                No document selected
              </p>
              <p className="text-sm text-base-content/40 mt-1 max-w-sm">
                Upload or select a document from the sidebar to start chatting
              </p>
            </div>
          </div>

        ) : (

          <>
            {/* chat header */}
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 border-b border-base-300 bg-base-100/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="btn btn-ghost btn-xs md:hidden -ml-1"
                  aria-label="Open documents"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <i
                  className={`
                    ${activeDocument.resourceType === "video"
                      ? "ti ti-video"
                      : "ti ti-file-type-pdf"
                    } text-base-content/50
                  `}
                  style={{ fontSize: 16 }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-base-content truncate max-w-[12rem] sm:max-w-md">
                    {activeDocument.filename}
                  </p>
                  <p className="text-xs text-base-content/40">
                    {activeDocument.resourceType === "pdf" && activeDocument.pageCount
                      ? `${activeDocument.pageCount} pages · `
                      : ""}
                    Ready to answer
                  </p>
                </div>
              </div>

              {/* clear chat button */}
               <button
                onClick={() => dispatch(logoutUser())}
                className="text-xs text-base-content/40 hover:text-base-content/60
                           border border-base-300 rounded px-2 py-1
                           hover:bg-base-200 transition-colors"
              >
                Logout
              </button>
            </div>

            {/* messages */}
            <ChatWindow documentId={activeDocument._id} />

            {/* input */}
            <ChatInput documentId={activeDocument._id} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
