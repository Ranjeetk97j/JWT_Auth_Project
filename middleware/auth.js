import jwt from "jsonwebtoken";
import User from "../model/user.js";

export var checkUserAuth = async (req, res, next) =>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try{
            //Get Token from Header
            token = authorization.split(' ')[1]
            // console.log(token);
            // console.log(authorization);

            //Verify Token 
            const {userId} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(jwt.verify(token, process.env.JWT_SECRET_KEY));
            // console.log(userId);

            //Get User from Token 
            req.user = await User.findById(userId).select('-password')
            // console.log(req.user);
            next()
        }catch(err){
            console.log(err);
            res.status(401).send({"status":"failed","message":"Unauthorized User"})
        }

    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized User, No Token"})
    }
}

