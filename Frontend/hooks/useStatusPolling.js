import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getMyDocuments } from "../src/store/slices/documentSlice";
import { getDocumentStatus } from "../src/api/chatApi"

const useStatusPolling = () => {
  const dispatch = useDispatch();
  const intervalsRef = useRef({}); // track multiple polling intervals

  const startPolling = (documentId) => {
    // don't start duplicate polling
    if (intervalsRef.current[documentId]) return;

    console.log(`Starting polling for document: ${documentId}`);

    const interval = setInterval(async () => {
      try {
        const { status } = await getDocumentStatus(documentId);
        console.log(`Document ${documentId} status: ${status}`);

        // stop polling when done
        if (status === "processed" || status === "failed") {
          clearInterval(intervalsRef.current[documentId]);
          delete intervalsRef.current[documentId];
          console.log(`Polling stopped for document: ${documentId}`);

          // refresh sidebar document list
          dispatch(getMyDocuments());
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(intervalsRef.current[documentId]);
        delete intervalsRef.current[documentId];
      }
    }, 3000); // every 3 seconds

    intervalsRef.current[documentId] = interval;
  };

  const stopPolling = (documentId) => {
    if (intervalsRef.current[documentId]) {
      clearInterval(intervalsRef.current[documentId]);
      delete intervalsRef.current[documentId];
    }
  };

  // cleanup all intervals when component unmounts
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  return { startPolling, stopPolling };
};

export default useStatusPolling;