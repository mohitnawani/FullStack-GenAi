const express = require('express');
const authRouter = express.Router();
const {register, login, logout}= require('../controllers/UserAuth');
// const authMiddleware = require('../middleware/authMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

module.exports = authRouter;
