const { BadRequest, NotFound } = require("../errors");
const Messages = require("../models/messages");
const User = require("../models/user");

const getFriends = async (req, res) => {
  const { id } = req.params;
  let frndMsgs = [];
  const friends = await User.find({ _id: { $ne: id } });
  if (!friends) {
    throw new BadRequest("No users found");
  }
  for (const frnd of friends) {
    let lastMsg = await getLastMessage(id, frnd._id);
    frndMsgs = [...frndMsgs, { frndInfo: frnd, lMsg: lastMsg }];
  }
  return res.status(200).json(frndMsgs);
};

const getLastMessage = async (userId, friendId) => {
  const lastMessage = await Messages.findOne({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  }).sort({ updatedAt: -1 });
  return lastMessage;
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

const messsageSeen = async (req, res) => {
  const { _id } = req.body;
  const updateSeen = await Messages.findByIdAndUpdate(
    _id,
    { status: "seen" },
    { new: true }
  );
  if (!updateSeen) {
    throw new BadRequest("Unable to update message");
  }
  console.log(updateSeen);
  return res.status(200).json(updateSeen);
};
const messsageDeliver = async (req, res) => {
  const { _id } = req.body;
  const updateDeliver = await Messages.findByIdAndUpdate(
    _id,
    { status: "delivered" },
    { new: true }
  );
  if (!updateDeliver) {
    throw new BadRequest("Unable to update message");
  }
  return res.status(200).json(updateDeliver);
};

module.exports = {
  messsageDeliver,
  messsageSeen,
  getFriends,
  sendMessage,
  getMessages,
  sendImageMessage,
};
