const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

//@description     Get  all messages
//@route           GET /messages
//@access          Public
const allMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();
  res.header("Access-Control-Allow-Origin", "*");
  res.send(messages);
});

const sendMessage = async (params) => {
  try {
    var message = await Message.create(params);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { allMessages, sendMessage };
