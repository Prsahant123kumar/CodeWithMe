const mongoose=require('mongoose')
const { UserAuth: User } = require("./UserAuth");
const Message =require("./Message")

const conversationSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId, //  typo: should be `type`, not `types`
      ref: "Message",
      default: []
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema); // model name should not be schema name
