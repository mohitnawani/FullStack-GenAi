// services/ragService.js

const { GoogleGenAI } = require("@google/genai");
const extractTextFromPDF = require("./pdfService");
const splitTextIntoChunks = require("./textChunker");
const { generateEmbeddings, embeddings } = require("./embeddingService");
const { upsertVectors, querySimilarChunks } = require("./pineconeService");
const Document = require("../models/Document");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── INGESTION (called after PDF uploaded to Cloudinary) ──
const ingestDocument = async (documentId, cloudinaryUrl) => {
  try {
    // update status → processing
    await Document.findByIdAndUpdate(documentId, { status: "processing" });

    // Step 1: extract text from PDF
    const { text, pageCount } = await extractTextFromPDF(cloudinaryUrl);

    // Step 2: split into chunks
    const chunks = await splitTextIntoChunks(text, documentId);

    // Step 3: generate embeddings
    const embeddedChunks = await generateEmbeddings(chunks);

    // Step 4: store in pinecone
    await upsertVectors(embeddedChunks, documentId);

    // Step 5: update document in mongodb
    await Document.findByIdAndUpdate(documentId, {
      status: "processed",
      pageCount,
      vectorNamespace: documentId,
    });

    return { success: true, totalChunks: chunks.length };

  } catch (error) {
    await Document.findByIdAndUpdate(documentId, { status: "failed" });
    throw new Error(`Ingestion failed: ${error.message}`);
  }
};

// ── CHAT (called when user asks a question) ──
// const chatWithDocument = async (question, documentId, chatHistory = []) => {
  try {
    // Step 1: convert question to vector
    const questionVector = await embeddings.embedQuery(question);

    // Step 2: find similar chunks from pinecone
    const relevantChunks = await querySimilarChunks(
      questionVector,
      documentId,
      5  // top 5 chunks
    );

    // Step 3: build context from chunks
    const context = relevantChunks
      .map((chunk, i) => `Context ${i + 1}:\n${chunk.text}`)
      .join("\n\n");

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
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = result.text;

    return {
      answer,
      relevantChunks,
    };

  } catch (error) {
    throw new Error(`Chat failed: ${error.message}`);
  }
// };

export { ingestDocument, chatWithDocument };