const validator = require("validator");
const { BadRequest, Unthenticated } = require("../errors");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const createTokenUser = require("../utils/createTokenUser");
const { createToken, attachCookies } = require("../utils/jwt");

const userRegister = async (req, res) => {
  const { username, email, password, confirmPassword, image } = req.body;
  if (!email || !username || !password || !confirmPassword || !image) {
    throw new BadRequest("Please insert all the fields");
  }
  if (email && !validator.isEmail(email)) {
    throw new BadRequest("Please provide valid email");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new BadRequest("User already exists");
  }
  if (password !== confirmPassword) {
    throw new BadRequest("passwords did not match");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    image,
  });
  if (!user) {
    throw new BadRequest("Something went wrong");
  }
  const tokenUser = createTokenUser(user);
  const token = createToken({ payload: tokenUser });
  attachCookies({ res, user });
  return res.status(201).json({ token: token });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please insert all the fields");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("Email not found");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Unthenticated("Password is not correct");
  }
  const tokenUser = createTokenUser(user);
  attachCookies({ res, user: tokenUser });
  const { password: pass, ...rest } = user._doc;
  return res.status(200).json(rest);
};
const userLogout = async (req, res) => {
  return res.status(200).clearCookie("token").json({ success: "true" });
};

module.exports = { userRegister, userLogin, userLogout };
