const express=require('express');
const chatRouter= express.Router();

const userMiddleware = require('../middleware/userMiddleware');
const {chat}=require('../controllers/ChatController')

chatRouter.get('/chat', userMiddleware, chat);

module.exports = chatRouter