const { StatusCodes } = require("http-status-codes");
const customErrorHandler = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.code === 11000) {
    customError.msg = `Duplicate key ${Object.keys(err.keyValue)} entered`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "ValidationError") {
    customError.msg = err.message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customError.msg = "Nothing found with this id";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
module.exports = customErrorHandler;
