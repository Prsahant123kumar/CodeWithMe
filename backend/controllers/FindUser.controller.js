const mongoose = require("mongoose")
const { UserName } = require("../models/PlatFormUserName")
const Conversation = require("../models/Conversation");
const {Information}=require("../models/UserInformation")

const findUser = async (req, res) => {
    try {
        const { name, platform } = req.body;
        console.log(name, platform)

        if (!name || !platform) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await UserName.findOne({ [platform]: name });
        console.log(user)

        if (!user) {
            return res.status(409).json({
                success: false,
                message: "User Not found in CodeWithMe"
            });
        }

        const conversation = await Conversation.findOne({
            members: { $all: [req.id, user.authId] }
        }).populate("messages");

        console.log(req.id, user.authId, conversation)

        return res.status(200).json({
            success: true,
            message: "User Found Successfully",
            user: user,
            messages: conversation ? conversation.messages : []
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};



const findAllContacts = async (req, res) => {
    try {
        const userId = "68555b79b77cab4abb152c03"; // The user ID you're searching for

        const conversations = await Conversation.find({
            members: userId
        })
            .populate('members') // populate member info
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 } // get only the most recent message
            })
            .sort({ updatedAt: -1 }); // sort by most recently updated
        console.log(conversations)
        return res.status(200).json({
            success: true,
            message: "User Found Successfully",
            users: conversations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { findUser , findAllContacts }