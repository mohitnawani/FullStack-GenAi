const express = require('express');
const {  generateUploadSignature,
  saveDocumentMetadata,
  deleteDocument,
  DocumentIngest,getMyDocuments,getDocumentStatus} = require('../controllers/UploadController');
const uploadRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');

uploadRouter.get('/upload-signature', userMiddleware, generateUploadSignature);
uploadRouter.post('/save', userMiddleware, saveDocumentMetadata);
uploadRouter.post('/ingest', userMiddleware, DocumentIngest);
uploadRouter.get('/my-documents', userMiddleware, getMyDocuments);
uploadRouter.delete('/:id', userMiddleware, deleteDocument);
uploadRouter.get('/:documentId/status',userMiddleware,getDocumentStatus)

module.exports = uploadRouter;
