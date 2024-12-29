import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

       
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

       
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

       
        const hashedpassword = await bcryptjs.hash(password, 10);

        
        const user = new User({
            name,
            email,
            username,
            password: hashedpassword,
        });
        await user.save();

        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

       
        res.status(201).json({
            message: "User created successfully",
            user: {
                name: user.name,
                email: user.email,
                username: user.username,
            },
        });

       
        const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;
        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl);
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError.message);
            
        }
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const login = async(req,res)=>{
 try {
    const{username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const isMatch = await bcryptjs.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid Credentials"});
    }
    
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
    });
    console.log('user logged in successfully');
    res.status(200).json({
        message:"Login Successfull",
        user:{
            name:user.name,
            email:user.email,
            username:user.username,
        }
    });

    
 } catch (error) {
    throw new Error(error.message);
    res.status(500).json({message:"Server Error"});
 }
};

export const logout = async(req,res)=>{
 res.clearCookie('token');
 res.status(200).json({message:"Logout Successfull"})
};

export const getCurrentUser = async(req,res)=>{
    try {
        req.json(req.user);
        res.status(200).json({message:"User Fetched Successfully",user:req.user});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
        
    }
};
