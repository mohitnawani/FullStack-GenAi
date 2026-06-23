const ChatHistory = require("../models/ChatHistory");
const Document = require("../models/Document");
const {chatService} = require("../services/chatService")

// POST /api/chat
const chat = async (req, res) => {
  try {
    const { question, documentId } = req.body;
    const userId = req.result._id;

    // validate input
    if (!question || !documentId) {
      return res.status(400).json({
        success: false,
        message: "question and documentId are required",
      });
    }

    //check document exists and belongs to user
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    //check document is processed
    if (document.status !== "processed") {
      return res.status(400).json({
        success: false,
        message: `Document is ${document.status} — please wait until indexing is complete`,
      });
    }

    //get existing chat history for context
    const existingChat = await ChatHistory.findOne({ userId, documentId });
    const chatHistory = existingChat ? existingChat.messages : [];

    // Step 5: get answer from RAG pipeline
    const { answer} = await chatService(
      question,
      documentId,
      chatHistory
    );

    // Step 6: save messages to ChatHistory
    const userMessage = { role: "user", content: question };
    const assistantMessage = { role: "assistant", content: answer };

    await ChatHistory.findOneAndUpdate(
      { userId, documentId },
      {
        $push: {
          messages: {
            $each: [userMessage, assistantMessage],
          },
        },
      },
      { upsert: true, new: true } // create if doesn't exist
    );

    // Step 7: return answer
    return res.status(200).json({
      success: true,
      data: {
        question,
        answer,
      },
    });

  } catch (error) {
    console.error("Chat error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// // GET /api/chat/:documentId  — fetch chat history
// const getChatHistory = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const userId = req.result._id;

//     const chatHistory = await ChatHistory.findOne({ userId, documentId });

//     return res.status(200).json({
//       success: true,
//       messages: chatHistory ? chatHistory.messages : [],
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // DELETE /api/chat/:documentId  — clear chat history
// const clearChatHistory = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const userId = req.result._id;

//     await ChatHistory.findOneAndUpdate(
//       { userId, documentId },
//       { $set: { messages: [] } }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Chat history cleared",
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

module.exports = {chat};