import  axiosClient from "../utils/axiosclient";

//POST /api/chat 
const askQuestion = async(question,documentId)=>{
    const response = await axiosClient.post("/api/chat",{
        question,
        documentId,
    })
    return response.data;
}

// GET /api/chat/:documentId-- this is for fortend
const getChatHistory= async (documentId)=>{
    const response = await axiosClient.get(`/api/chat/${documentId}`)
    return response.data;
}

// DELETE /api/chat/:documentId — clear chat history
const clearChatHistory = async (documentId) => {
  const response = await axiosClient.delete(`/api/chat/${documentId}`);
  return response.data;
};

// GET /api/documents/:documentId/status — poll document status
const getDocumentStatus = async (documentId) => {
  const response = await axiosClient.get(`/api/documents/${documentId}/status`);
  return response.data;
};

export { askQuestion, getChatHistory, clearChatHistory, getDocumentStatus };
