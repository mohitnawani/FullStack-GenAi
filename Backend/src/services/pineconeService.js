// services/pineconeService.js
const { Pinecone } = require("@pinecone-database/pinecone");
const axios = require("axios");
// initialize pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(process.env.PINECONE_INDEX);

// ── UPSERT (store vectors during ingestion) ──
const upsertVectors = async (embeddedChunks, documentId) => {
  try {
    // console.log(embeddedChunks)
    
    const namespaceId = documentId.toString(); // ✅ convert ObjectId to string
    console.log(namespaceId)

    const batchSize = 100;
    for (let i = 0; i < embeddedChunks.length; i += batchSize) {
      const batch = embeddedChunks.slice(i, i + batchSize);

      console.log(batch)
      console.log(`upserting batch ${i} with ${batch.length} vectors`);
      await index.namespace(namespaceId).upsert({ records: batch });
    }

    return { success: true, vectorCount: embeddedChunks.length };
  } catch (error) {
    throw new Error(`Pinecone upsert failed: ${error.message}`);
  }
};


// ── QUERY (find similar chunks during chat) ──
// const querySimilarChunks = async (questionVector, documentId, topK = 5) => {
//   try {
//     const results = await index.namespace(documentId).query({
//       vector: questionVector,
//       topK,                    // return top 5 most similar chunks
//       includeMetadata: true,   // include original text in results
//     });

//     // extract just the text from results
//     const relevantChunks = results.matches.map((match) => ({
//       text: match.metadata.text,
//       score: match.score,         // similarity score 0-1
//       chunkIndex: match.metadata.chunkIndex,
//     }));

//     return relevantChunks;

//   } catch (error) {
//     throw new Error(`Pinecone query failed: ${error.message}`);
//   }
// };

// ── DELETE (when user deletes a document) ──
// const deleteDocumentVectors = async (documentId) => {
//   try {
//     await index.namespace(documentId).deleteAll();
//     return { success: true };
//   } catch (error) {
//     throw new Error(`Pinecone delete failed: ${error.message}`);
//   }
// };

module.exports = { upsertVectors , index };
