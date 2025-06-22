const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => value.length > 0, // 🔥 typo: "length" not "lenght"
      message: "Message cannot be empty"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // 🔥 typo: should be `timestamps` (plural)

module.exports = mongoose.model("Message", MessageSchema);
