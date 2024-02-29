const jwt = require("jsonwebtoken");

const createToken = ({ payload }) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET);
  return token;
};
const validateToken = (token) => {
  const validToken = jwt.verify(token, process.env.JWT_SECRET);
  return validToken;
};
const attachCookies = ({ res, user }) => {
  const token = createToken({ payload: user });
  res.cookie("token", token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};
module.exports = { createToken, validateToken, attachCookies };
