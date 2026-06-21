const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const splitTextIntoChunks = async (text, documentId) => {
  try {

    // console.log(text)
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
    });

    const rawChunks = await splitter.splitText(text);
    // console.log(rawChunks)

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