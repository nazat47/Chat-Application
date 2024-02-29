const express = require("express");
const { userRegister, userLogin } = require("../controllers/auth");
const router = express.Router();

router.route("/register").post(userRegister);
router.post("/login", userLogin);
module.exports = router;
