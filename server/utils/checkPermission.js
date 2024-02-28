const { Unthenticated } = require("../errors");

const checkPermission = (reqUser, userId) => {
  if (reqUser.role === "admin") {
    return;
  }
  if (reqUser.id === userId.toString()) {
    return;
  }
  throw new Unthenticated("Not allowed to access");
};
module.exports = checkPermission;
