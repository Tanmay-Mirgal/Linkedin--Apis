import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    "author":{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true

    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    image:{
        type:String
    },
    comments:[{
        content:{
            type:String,
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }]
}
,{
    timestamps:true
}
);

const Post = mongoose.model("Post",postSchema);

export default Post;