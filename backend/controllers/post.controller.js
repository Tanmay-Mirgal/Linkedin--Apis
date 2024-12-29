import  Post  from "../models/post.model.js";
import cloudinary from '../lib/cloudinary.config.js';

export const getFeedPosts = async (req,res)=>{
    try {
        const posts = await Post.find({author:{$in : req.user.connections}})
        .populate("author","name profilePicture username headline")
        .populate("comments.user","name profilePicture ")
        .sort({createdAt:-1});
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });  
    }
}

export const createPost = async (req,res)=>{
    try {
        const {content,image}= req.body;
        let newPost ;
        if(image){
            const resultImg = await cloudinary.uploader.upload(image);
            newPost = new Post ({
                author:req.user._id,
                content,
                image:resultImg.secure_url,
            })

        }
        else{
            newPost = new Post ({
                author:req.user._id,
                content,
            })
        }
        await newPost.save();
        res.status(201).json(newPost);

        } catch (error) {
         console.error("Error in createPost controller:", error);
            res.status(500).json({ message: "Server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        //check if the user is the author of the post
        if(post.author.tostring() !== userId.tostring()){
            return res.status(403).json({message:"You are not authorized to delete this post"});
        }
        if(post.image){
           //https://res.cloudinary.com/dmspullpt/image/upload/v1732367793/cld-sample-5.jpg
           //v1732367793/cld-sample-5.jpg
           //v1732367793/cld-sample-5

            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({message:"Post deleted successfully"});
    } catch (error) {
        console.error("Error in deletePost controller:", error);
        res.status(500).json({ message: "Server error" });
        
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.post;
        const post = await Post.findById(postId)
        .populate("author","name profilePicture username headline")
        .populate("comments.user","name profilePicture ")

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getPostById controller:", error);
        res.status(500).json({ message: "Server error" });
        
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const {content} = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        user: req.user._id,
                        content,
                    },
                },
            },
            { new: true }
        ).populate("author", "name profilePicture username headline")
        .populate("comments.user", "name profilePicture ");
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in createComment controller:", error);
        res.status(500).json({ message: "Server error" });
        
    }
}

