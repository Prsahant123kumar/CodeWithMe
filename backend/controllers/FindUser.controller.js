const mongoose = require("mongoose")
const { UserName } = require("../models/PlatFormUserName")
const Conversation = require("../models/Conversation");

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
        const userId = "685a5374902bda72d2f70e7c"; // The user ID you're searching for

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
                    const info = await Information.findOne({ authId: member._id.toString() });
                    if (info) {
                        allUser[i] = {
                            id: info.authId,
                            name: info.fullname,
                            avatar: info.profilePicture,
                            lastMessage: populatedConversation.messages[0]?.message || null,
                            lastMessageTime: populatedConversation.messages[0]?.createdAt || null
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