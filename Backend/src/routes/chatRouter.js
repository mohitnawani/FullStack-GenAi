const express=require('express');
const chatRouter= express.Router();

const userMiddleware = require('../middleware/userMiddleware');
const {
  chat,
  getChatHistory,
  clearChatHistory,
}=require('../controllers/ChatController')

chatRouter.post('/chat', userMiddleware, chat);
chatRouter.get('/chat/:documentId', userMiddleware, getChatHistory);
chatRouter.delete('/chat/:documentId', userMiddleware, clearChatHistory);

module.exports = chatRouter
