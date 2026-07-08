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
      console.log("Starting PDF text extraction");
      const result = await extractTextFromPDF(cloudinaryUrl);
      text = result.text;
      pageCount = result.pageCount;
      console.log("PDF text extracted", { pageCount, textLength: text?.length || 0 });
    }

    if (resourceType === "video") {
      console.log("Starting video text extraction");
      const result = await extractTextFromVideo(cloudinaryUrl);
      text = result.text;
      duration = result.duration;
      console.log("Video text extracted", { duration, textLength: text?.length || 0 });
    }

    // Step 2: split into chunks
    console.log("Splitting extracted text into chunks");
    const chunks = await splitTextIntoChunks(text, documentId);
    console.log("Chunks created", chunks.length);

    // Step 3: generate embeddings
    console.log("Generating embeddings");
    const embeddedChunks = await generateEmbeddings(chunks);
    console.log("Embeddings generated", embeddedChunks.length);

    // Step 4: store in pinecone
    console.log("Upserting vectors to Pinecone");
    await upsertVectors(embeddedChunks, documentId);
    console.log("Vectors upserted");

    // Step 5: update mongodb
    await Document.findByIdAndUpdate(documentId, {
      status: "processed",
      pageCount,          // null for video ✅
      duration,           // null for pdf ✅
      vectorNamespace: documentId,
    });

    return { success: true, totalChunks: chunks.length };

  } catch (error) {
    console.error("Ingest document error:", error);
    await Document.findByIdAndUpdate(documentId, { status: "failed" });
    throw new Error(`Ingestion failed: ${error.message}`);
  }
};



module.exports = { ingestDocument };
