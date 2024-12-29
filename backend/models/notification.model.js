import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['comment','connection','like']
    },
    relatedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    relatedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    read:{
        type:Boolean,
        default:false
    },
    
});