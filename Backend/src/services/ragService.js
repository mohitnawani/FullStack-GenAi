const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const extractTextFromPDF = require("./pdfService");
const splitTextIntoChunks = require("./textChunker");
const { generateEmbeddings, embeddings } = require("./embeddingService");
const { upsertVectors, querySimilarChunks } = require("./pineconeService");
const Document = require("../models/Document");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── INGESTION (called after PDF uploaded to Cloudinary) ──
const ingestDocument = async (documentId, cloudinaryUrl) => {
  try {
    console.log(`reched ${documentId} and ${cloudinaryUrl}`)
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
}


// ── RETRIVAL PIPELINE
const retriveDocument=async ()=>{
  try{

  }

  catch(err)
  {
    console.log("error ", err)
    
  }
}




module.exports = { ingestDocument };