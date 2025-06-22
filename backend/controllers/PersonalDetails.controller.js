const { Information } = require("../models/UserInformation");
const mongoose = require("mongoose");

const EnterPersonaldetails = async (req, res) => {
    try {
        const { fullname,College,Passing_Year,profilePicture,Country } = req.body;
        if (!fullname || !College ||! Passing_Year || !profilePicture || !Country) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newUser = await Information.create({
            fullname: fullname,
            College:  College, // Already hashed
            Passing_Year: Passing_Year,
            profilePicture: profilePicture,
            Country: Country,
            authId:req.id,
            isVerified: true
        });
        console.log(newUser)  

        return res.status(200).json({
            success:true,
            newUser,
            message:"Personal Details Entered Successfully"
        })

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {

        const userId = req.id;
        console.log(userId)
        const { fullname,College,Passing_Year,profilePicture,Country } = req.body;
        let cloudResponse;
        if (profilePicture) {
            cloudResponse = await cloudinary.uploader.upload(profilePicture);
        } 
        // console.log(req.id,req._id,req.body);
        const updatedData = {fullname,College,Passing_Year,profilePicture,Country};

        const user = await Information.findOneAndUpdate({authId:userId}, updatedData, { new: true }).select("-password");

        return res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = { EnterPersonaldetails , updateProfile};
