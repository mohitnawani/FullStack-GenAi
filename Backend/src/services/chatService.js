const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const splitTextIntoChunks = require("./textChunker");
const { generateEmbeddings, embeddings } = require("./embeddingService");
const { upsertVectors } = require("./pineconeService");
const Document = require("../models/Document");
const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

const client = new GoogleGenAI({});

const chatService = async (question, documentId, chatHistory = []) => {
  try {
    // Step 1: convert question to vector
    const questionVector = await embeddings.embedQuery(question);

    // Step 2: find similar chunks from pinecone
        const searchResults = await pineconeIndex.namespace(documentId).query({
        topK: 5,
        vector: questionVector,
        includeMetadata: true,
        });

    console.log(`serchResult ${searchResults}`)

    const context = searchResults.matches
      .map((match) => match.metadata.text)
      .join("\n\n---\n\n");

    // Step 4: build chat history string
    const historyString = chatHistory
      .map((m) => `${m.role === "user" ? "Student" : "AI"}: ${m.content}`)
      .join("\n");

    // Step 5: build prompt
    const prompt = `
You are an AI tutor helping a student understand their study material.
Answer the question based ONLY on the context provided below.
If the answer is not in the context, say "I could not find this in your document."
Keep answers clear and concise.

Context from the document:
${context}

${historyString ? `Previous conversation:\n${historyString}\n` : ""}

Student Question: ${question}

Answer:`;

    // Step 6: get answer from gemini 2.5 flash
    const result = await client.interactions.create({
      model: "gemini-3.5-flash",
      input: prompt,
    });
    console.log(result.output_text);

    const answer = result.output_text;

    return {
      answer,
    };
  } catch (error) {
    throw new Error(`Chat failed: ${error.message}`);
  }
};

module.exports = { chatService };
