const  { RecursiveCharacterTextSplitter }= from( "langchain/text_splitter");

const splitTextIntoChunks = async (text, documentId) => {
  try {
    // Step 1: create the splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,      // each chunk = max 300 characters
      chunkOverlap: 50,    // 50 characters overlap between chunks
    });

    // Step 2: split the text
    const rawChunks = await splitter.splitText(text);

    // Step 3: attach metadata to each chunk
    const chunks = rawChunks.map((chunkText, index) => ({
      id: `${documentId}_chunk_${index}`,  // unique id for pinecone
      text: chunkText,                      // actual chunk text
      metadata: {
        documentId,                         // which document
        chunkIndex: index,                  // chunk number
        totalChunks: rawChunks.length,      // total chunks
      },
    }));

    return chunks;

  } catch (error) {
    throw new Error(`Text chunking failed: ${error.message}`);
  }
};

export default splitTextIntoChunks;