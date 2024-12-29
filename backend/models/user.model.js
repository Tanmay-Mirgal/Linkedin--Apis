import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
       name:{
        type:String,
        required:true,
        
       },
       username:{
        type:String,
        required:true,
        unique:true,
       },
       email:{
        type:String,
        required:true,
        unique:true,
       },
       password:{
        type:String,
        required:true,
       },
       profilePicture:{
        type:String,
        default:"",
       },
       bannerimg:{
        type:String,
        default:"",
       },
       headline:{
        type:String,
        default:"Linkedin User ",
       },
       about:{
        type:String,
        default:"",
       },
       location:{
        type:String,
        default:"",
       },
       skills:[String],
       experience:[{
        title:String,
        company:{
            type:String,
            default:"",
        },
        startDate:Date,
        endDate:Date,
        description:String,
       }],
       education:[{
        school:{
            type:String,
            default:"",
        },
        fieldOfStudy:{
            type:String,
            default:"",
        },
        startYear:Number,
        endYear:Number,
     
       }],
       connection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       }]


    
},{timestamps:true})


const User = mongoose.model('User',userSchema);
export default User;