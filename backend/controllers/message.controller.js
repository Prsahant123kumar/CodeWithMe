const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { io, getReceiverSocketId } = require("../socket/server");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const { receiverId, message } = req.body;
    
    let conversation;

    if (String(senderId) === String(receiverId)) {
      conversation = await Conversation.findOne({
        $and: [
          { members: senderId },
          { "members.1": { $exists: false } }
        ]
      });
      if (!conversation) {
        conversation = await Conversation.create({ members: [senderId] });
      }
    } else {
      // Regular two-person conversation
      conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] }
      });
      if (!conversation) {
        conversation = await Conversation.create({
          members: [senderId, receiverId],
        });
      }
    }

    const newMessage = new Message({ 
      senderId, 
      receiverId, 
      message,
      createdAt: new Date()
    });
    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Get socket IDs for both users
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message received", newMessage);
    }

    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("message received", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.id; 
    const receiverId = req.params.id;

    let conversation;

    if (String(senderId) === String(receiverId)) {
      conversation = await Conversation.findOne({
        $and: [
          { members: senderId },
          { "members.1": { $exists: false } } 
        ]
      }).populate("messages");
    } else {
      conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] }
      }).populate("messages");
    }

    if (!conversation) return res.json([]);

    res.json(conversation.messages);
  } catch (err) {
    console.error("Fetch messages error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };
