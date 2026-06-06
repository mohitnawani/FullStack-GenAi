require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

         return res.status(201).json({message: 'User registered successfully'});

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

        return res.status(200).json({token, message: 'Login successful'});
    }

    catch(err)
    {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}



module.exports = { register, login };
