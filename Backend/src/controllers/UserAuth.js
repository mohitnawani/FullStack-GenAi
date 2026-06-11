require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require("cookie");
const redis = require('../config/redisdb');

const register = async (req , res)=>{
    try{
        const {firstName, LastName, emailId, password} = req.body;

        const user = new User({
            firstName,
            LastName,
            emailId,
            password: await bcrypt.hash(password, 10)
        })

         await user.save();

         return res.status(201).json({message: 'User registered successfully',
         });

    }

    catch(err)
    {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}
const login = async (req , res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId});
        if(!user)
        {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
        { userId: user._id , emailId: user.emailId},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });
        return res.status(200).json({message: 'Login successful'});
    }

    catch(err)
    {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}
const logout = async (req, res) => {
  try {
    const parsedCookies = req.cookies || (req.headers.cookie ? cookie.parse(req.headers.cookie) : {});
    const { token } = parsedCookies;
    console.log('Logout token:', token);

    if (!token) {
      return res.status(400).json({ message: 'No token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded) {
      return res.status(400).json({ message: 'Invalid token' });
    }


    await redis.set(`token:${token}`, "Blocked");
    await redis.expireAt(`token:${token}`, decoded.exp);

    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });

  } catch (err) {
    return res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};



module.exports = { register, login, logout };
