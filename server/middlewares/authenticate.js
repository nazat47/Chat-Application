const { Unthenticated, Unauthorized } = require("../errors");
const { validateToken } = require("../utils");

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new Unthenticated("Not allowed to access the route");
  }
  try {
    const { name, email, id, role } = validateToken(token);
    req.user = {
      name,
      email,
      id,
      role,
    };
    next();
  } catch (error) {
    throw new Unthenticated("Not allowed to access the route");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Unauthorized("Not authorized to access");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
