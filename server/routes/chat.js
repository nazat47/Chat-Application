const express = require("express");
const {
  getFriends,
  sendMessage,
  getMessages,
  sendImageMessage,
  messsageSeen,
  messsageDeliver,
} = require("../controllers/chat");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();

router.get("/get-friends/:id", getFriends);
router.post("/send-message", sendMessage);
router.post("/send-image-message", sendImageMessage);
router.post("/get-messages/:friendId", getMessages);
router.patch("/seen-message", messsageSeen);
router.patch("/deliver-message", messsageDeliver);

module.exports = router;
