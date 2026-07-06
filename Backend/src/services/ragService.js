const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const extractTextFromPDF = require("./pdfService");
const splitTextIntoChunks = require("./textChunker");
const { generateEmbeddings, embeddings } = require("./embeddingService");
const { upsertVectors, querySimilarChunks } = require("./pineconeService");
const Document = require("../models/Document");
const extractTextFromVideo = require("./videoService");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── INGESTION (called after PDF uploaded to Cloudinary) ──
const ingestDocument = async (documentId, cloudinaryUrl, resourceType) => {
  try {
    console.log(`reached ${documentId} and ${cloudinaryUrl}`);

    await Document.findByIdAndUpdate(documentId, { status: "processing" });

    let text;
    let pageCount = null;
    let duration = null;

    // Step 1: extract text
    if (resourceType === "pdf") {
      const result = await extractTextFromPDF(cloudinaryUrl);
      text = result.text;
      pageCount = result.pageCount;
    }

    if (resourceType === "video") {
      const result = await extractTextFromVideo(cloudinaryUrl);
      text = result.text;
      duration = result.duration;
    }

    // Step 2: split into chunks
    const chunks = await splitTextIntoChunks(text, documentId);

    // Step 3: generate embeddings
    const embeddedChunks = await generateEmbeddings(chunks);

    // Step 4: store in pinecone
    await upsertVectors(embeddedChunks, documentId);

    // Step 5: update mongodb
    await Document.findByIdAndUpdate(documentId, {
      status: "processed",
      pageCount,          // null for video ✅
      duration,           // null for pdf ✅
      vectorNamespace: documentId,
    });

    return { success: true, totalChunks: chunks.length };

  } catch (error) {
    await Document.findByIdAndUpdate(documentId, { status: "failed" });
    throw new Error(`Ingestion failed: ${error.message}`);
  }
};



module.exports = { ingestDocument };