const User =require("../models/user")
const redis =require("../config/redisdb");
const jwt =require("jsonwebtoken");

const userMiddleware= async(req,res,next)=>{
    try{
        console.log("User middleware called");
        const {token}=req.cookies;
        console.log("Token from cookies:", token);
        if(!token){
            throw new Error("Token is not present");
        }

        const payload =jwt.verify(token,process.env.JWT_SECRET);
        console.log("Token payload:", payload);
        const {_id}=payload;

        if(!_id)
        {
            throw new Error("Invalid Token");
        }

        const result = await User.findById(_id);
        console.log("User middleware - user found:", result);
        if(!result)
        {
            throw new Error("User Doesn't Exist");
        }
        //Check in redis blockList

        const IsBlocked =await redis.get(`token:${token}`);


        if(IsBlocked)
        {
            throw new Error("Invalid Token");
        }

        req.result =result;

        next();

    }

    catch(err)
    {
        res.status(401).send("Error: "+ err.message)
    }
}

module.exports =userMiddleware;
