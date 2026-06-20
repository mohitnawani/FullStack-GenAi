const { GoogleGenerativeAIEmbeddings } =require("@langchain/google-genai");

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "embedding-001",  // Gemini embedding model
});

const generateEmbeddings = async (chunks) => {
  try {
    const embeddedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        // convert each chunk text to a vector (array of numbers)
        const vector = await embeddings.embedQuery(chunk.text);

        return {
          id: chunk.id,              // "doc456_chunk_0"
          values: vector,            // [0.2, 0.8, 0.1, ...] 768 numbers
          metadata: {
            ...chunk.metadata,
            text: chunk.text,        // store original text too
          },
        };
      })
    );

    return embeddedChunks;

  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

export { embeddings, generateEmbeddings };