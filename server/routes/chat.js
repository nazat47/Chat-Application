const express = require("express");
const {
  getFriends,
  sendMessage,
  getMessages,
  sendImageMessage,
} = require("../controllers/chat");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();

router.get("/get-friends/:id", getFriends);
router.post("/send-message", sendMessage);
router.post("/send-image-message", sendImageMessage);
router.post("/get-messages/:friendId", getMessages);

module.exports = router;
