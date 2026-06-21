const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const splitTextIntoChunks = async (text, documentId) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
    });

    const rawChunks = await splitter.splitText(text);

    const chunks = rawChunks.map((chunkText, index) => ({
      id: `${documentId}_chunk_${index}`,
      text: chunkText,
      metadata: {
        documentId,
        chunkIndex: index,
        totalChunks: rawChunks.length,
      },
    }));

    return chunks;

  } catch (error) {
    throw new Error(`Text chunking failed: ${error.message}`);
  }
};

module.exports = splitTextIntoChunks;