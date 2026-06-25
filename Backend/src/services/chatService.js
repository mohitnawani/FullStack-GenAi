const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const splitTextIntoChunks = require("./textChunker");
const { generateEmbeddings, embeddings } = require("./embeddingService");
const { upsertVectors, querySimilarChunks } = require("./pineconeService");
const Document = require("../models/Document");

const chatService = async (question, documentId, chatHistory) => {
  try {

    return {
      answer: `This is a test response for: "${question}"`
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { chatService };