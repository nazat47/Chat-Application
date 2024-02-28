require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const app = express();
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 50,
  })
);
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Welcome to the chat app");
});

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
