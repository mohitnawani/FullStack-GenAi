const express = require('express');
const {  generateUploadSignature,
  saveDocumentMetadata,
  getMyDocuments} = require('../controllers/UploadController');
const uploadRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');

uploadRouter.get('/upload-signature', userMiddleware, generateUploadSignature);
uploadRouter.post('/save', userMiddleware, saveDocumentMetadata);
uploadRouter.get('/', userMiddleware, getMyDocuments);
// uploadRouter.delete('/:id', userMiddleware, deleteDocument);

module.exports = uploadRouter;
