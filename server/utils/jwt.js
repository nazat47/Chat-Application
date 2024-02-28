const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const validateToken = (token) => {
  const validToken = jwt.verify(token, process.env.JWT_SECRET);
  return validToken;
};
const attachCookies = (user, res) => {
  const token = createToken(user);
  res.cookie("token", token, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    signed: true,
  });
};
module.exports = { createToken, validateToken, attachCookies };
