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
const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials:true,
  })
);
app.use(helmet());
app.use(xss());
app.use(cookieParser());
// app.use(
//   rateLimit({
//     windowMs: 1000 * 60 * 15,
//     max: 50,
//   })
// );
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Welcome to the chat app");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/chat", chatRoute);

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;

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
