const express = require("express");
const { userRegister, userLogin, userLogout } = require("../controllers/auth");
const router = express.Router();

router.route("/register").post(userRegister);
router.post("/login", userLogin);
router.get("/logout", userLogout);
module.exports = router;
