import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);





connectDB();
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})