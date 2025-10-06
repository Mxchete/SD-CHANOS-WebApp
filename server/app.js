const express = require("express");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const potRoute = require("./routes/pot");
// const userRoute = require("./routes/user");
const plantRoute = require("./routes/plant");
const devNotifications = require("./routes/notifications");

// require('./auth/google');

const app = express();

app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

// define API routing information
app.use("/api/pot", potRoute);
// app.use("/api/user", userRoute);
app.use("/api/plant", plantRoute);
app.use("/api/dev-notifications", devNotifications);

app.get("/", (req, res) =>
  res.send("<h1 style='text-align: center'>CHANOS Webserver API</h1>")
);

module.exports = app;
