const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

// FIX: Use 'modelName' instead of 'model'
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-embedding-2",
});

const generateEmbeddings = async (chunks) => {
  try {
    console.log("Total chunks to embed:", chunks.length);

    const embeddedChunks = await Promise.all(
      chunks.map(async (chunk, index) => {

        // This method is correct and returns an array of numbers (Vector)
        const vector = await embeddings.embedQuery(chunk.text);
        console.log(`Chunk ${index} vector length:`, vector.length);

        return {
          id: chunk.id,
          values: vector,
          metadata: {
            ...chunk.metadata,
            text: chunk.text, // Mapping text to metadata is perfect for vector DBs like Pinecone
          },
        };
      }),
    );

    return embeddedChunks;
  } catch (error) {
    // Enhanced error logging to catch exact API gripes
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

module.exports = { generateEmbeddings,embeddings };
