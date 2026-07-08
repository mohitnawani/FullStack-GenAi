const User =require("../models/user")
const redis =require("../config/redisdb");
const jwt =require("jsonwebtoken");

const userMiddleware= async(req,res,next)=>{
    try{
        const {token}=req.cookies;

        if(!token){
            throw new Error("Token is not present");
        }

        const payload =jwt.verify(token,process.env.JWT_SECRET);
        const {_id}=payload;

        if(!_id)
        {
            throw new Error("Invalid Token");
        }

        const result = await User.findById(_id);

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
