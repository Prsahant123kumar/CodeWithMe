const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const getReceiverSocketId =require("../socket/server")

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id; // from auth middleware
    const {  receiverId,message } = req.body;
    console.log(message,receiverId,senderId)
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.id; // from auth middleware
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    }).populate("messages");

    // console.log(senderId,receiverId,conversation,"one")
    // console.log(conversation.messages,"hjgh")

    if (!conversation) return res.json([]);

    res.json(conversation.messages);
  } catch (err) {
    console.error("Fetch messages error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};





module.exports = { sendMessage, getMessages };
// controllers/search.controller.js
// const { PlatformUserName } = require("../models/PlatformUserName");
// const { Information } = require("../models/Information");

// const searchUsers = async (req, res) => {
//     const query = req.query.search;
//     if (!query || !query.includes("@")) {
//         return res.status(400).json({ error: "Invalid search format. Use username@platform" });
//     }
    
//     const [username, platform] = query.split("@");
    
//     const userPlatform = await PlatformUserName.findOne({
//         username: username.trim(),
//         platform: platform.trim().toLowerCase()
//     });
    
//     if (!userPlatform) {
//         return res.status(404).json({ error: "User not found" });
//     }
    
    
    
//     if (!userInfo || !userInfo.authId || userInfo.authId.length === 0) {
//         return res.status(404).json({ error: "User info not found" });
//     }
    
//     res.json({
//         _id: userInfo.authId[0]._id, // This is what you use for messages
//         fullname: userInfo.fullname,
//         profilePicture: userInfo.profilePicture,
//         platform: platform.toLowerCase()
//     });
// };