import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.config.js';

export const getSuggestedConnections = async (req,res)=>{
    try {
        const currentUser = await User.findById(req.user._id).select("connections");
        const suggestedUser = await User.find({
            _id:{
                $ne : req.user._id,//not equl to current user_.id
                $nin :currentUser.connections,//also in currentuser connections array the id is not present 

        },
        }).select("name username profilePicture headline").limit(2);
        res.status(200).json({message:"Suggested connections fetched successfully", suggestedUser});
    } catch (error) {
        
        res.status(500).json({message:"Server Error",error:error.message});
    }
}


export const getPublicProfile = async (req,res)=>{
    try {
        const user  = await User.findOne({username : req.params.username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User Fetched Successfully",user});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
}

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
			"skills",
			"experience",
			"education",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}

        // Handle profilePicture and bannerImg updates
		if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture);

			updatedData.profilePicture = result.secure_url;
		}

		if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg);

			updatedData.bannerImg = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);
		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};