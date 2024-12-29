import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

// From cookie parse the token  and if it is present then decode it to verify  it and then find the user by its ID  and then attach it to the req object so that we can access it in the route handler
export const protectRoute = async (req,res,next) => {
    try {
        const  token = req.cookies('token');
        if(!token){
            return res.status(401).json({message:"Not Authorized"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Not Authorized"});
        }
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({message:"Not Authorized"});
        }
        req.user = user ;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
}


