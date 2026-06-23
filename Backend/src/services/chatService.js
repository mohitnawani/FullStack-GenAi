const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const splitTextIntoChunks = require("./textChunker");
const { generateEmbeddings, embeddings } = require("./embeddingService");
const { upsertVectors, querySimilarChunks } = require("./pineconeService");
const Document = require("../models/Document");

const chatService=async(question,documentId,chatHistory)=>{
    try{
        console.log(question)
        console.log(documentId)
        console.log(chatHistory)

        res.status(200).json({ answer : "I am good" });
    }

    catch(err){
        res.status(400).json({error: `eroor is occured ${err}` });
    }
}
module.export={chatService}