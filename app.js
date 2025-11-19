const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/healthz", function (req, res, next) {
  res.sendStatus(200);
});
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/", indexRouter);

module.exports = app;
