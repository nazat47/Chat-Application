const CustomError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class Unthenticated extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
module.exports = Unthenticated;
