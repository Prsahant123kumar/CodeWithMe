const mongoose = require("mongoose")
const { UserName } = require("../models/PlatFormUserName")
const {UserAuth}=require("../models/UserAuth")
const Conversation = require("../models/Conversation");
const {Message}=require("../models/Message")

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
        const Name=await UserAuth.findById(user.authId);
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
            Name:Name.fullName,
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
        const userId = req.id; // The user ID you're searching for

        const conversations = await Conversation.find({
            members: userId
        })
            .populate('members') // populate member info
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 } // get only the most recent message
            })
            .sort({ updatedAt: -1 }); // sort by most recently updated
        // console.log(conversations)
        const allUser = []
        let i = 0
        for (let i = 0; i < conversations.length; i++) {
            const conversation = conversations[i];

            for (let j = 0; j < conversation.members.length; j++) {
                const member = conversation.members[j];

                if (member._id.toString() !== userId) {
                    const info = await UserAuth.findById(member._id.toString())
                    if (info) {
                        console.log(conversation.messages[0],"inFindUser")
                        const lastMessage=conversation.messages[0]?.message || null;
                        const lastMessageTime=conversation.messages[0]?.createdAt || null;
                        allUser[i] = {
                            id: info.authId,
                            name: info.fullName,
                            lastMessage: lastMessage,
                            lastMessageTime: lastMessageTime,
                            unreadCount: 5
                        };
                    }
                }
            }
        }
        return res.status(200).json({
            success: true,
            message: "User Found Successfully",
            allUser: allUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { findUser, findAllContacts }