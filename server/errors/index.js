const BadRequest = require("./badRequest");
const CustomError = require("./customError");
const NotFound = require("./notFound");
const Unthenticated = require("./unauthenticated");
const Unauthorized = require("./unauthorized");

module.exports = {
  CustomError,
  BadRequest,
  NotFound,
  Unauthorized,
  Unthenticated,
};
