const { BadRequest, NotFound } = require("../errors");
const Messages = require("../models/messages");
const User = require("../models/user");

const getFriends = async (req, res) => {
  const { id } = req.params;
  const friends = await User.find({ _id: { $ne: id } });
  if (!friends) {
    throw new BadRequest("No users found");
  }
  return res.status(200).json(friends);
};

const sendMessage = async (req, res) => {
  const { senderId, senderName, receiverId, text } = req.body;
  const insert = await Messages.create({
    senderId,
    senderName,
    receiverId,
    message: {
      text,
    },
  });
  if (!insert) {
    throw new BadRequest("Something went wrong");
  }
  return res.status(201).json(insert);
};

const sendImageMessage = async (req, res) => {
  const { senderId, senderName, receiverId, image } = req.body;
  const insert = await Messages.create({
    senderId,
    senderName,
    receiverId,
    message: {
      image,
    },
  });
  if (!insert) {
    throw new BadRequest("Something went wrong");
  }
  return res.status(201).json(insert);
};

const getMessages = async (req, res) => {
  const { userId } = req.body;
  const { friendId } = req.params;
  const getAllMessages = await Messages.find({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  });
  if (!getAllMessages) {
    throw new NotFound("Can not find any messages");
  }
  return res.status(200).json(getAllMessages);
};

module.exports = { getFriends, sendMessage, getMessages, sendImageMessage };
