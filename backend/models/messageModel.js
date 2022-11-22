const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    checkout_id: { type: Number },
    email: { type: String, trim: true },
    time: { type: Date, default: new Date() },
    name: { type: String, trim: true },
  },
  { timuestamps: true }
);

const MessageModel = mongoose.model("Message", messageModel);

module.exports = MessageModel;
