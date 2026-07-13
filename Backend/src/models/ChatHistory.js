const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

// one chat session per user per document
chatHistorySchema.index({ userId: 1, documentId: 1 }, { unique: true });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

module.exports= ChatHistory;