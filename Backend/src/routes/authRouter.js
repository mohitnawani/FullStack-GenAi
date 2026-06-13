const express = require('express');
const authRouter = express.Router();
const {register, login, logout}= require('../controllers/UserAuth');
const userMiddleware = require('../middleware/userMiddleware');
// const authMiddleware = require('../middleware/authMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/check', userMiddleware, (req, res) => {
  const { _id, firstName, emailId } = req.result;
  console.log("Auth check - user found:", { _id, firstName, emailId });
  return res.status(200).json({
    user: { _id, firstName, emailId },
    message: 'valid user'
  });
});

module.exports = authRouter;
