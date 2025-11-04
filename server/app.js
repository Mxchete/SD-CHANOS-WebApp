const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const potRoute = require("./routes/pot");
// const userRoute = require("./routes/user");
const plantRoute = require("./routes/plant");
const devNotifications = require("./routes/notifications");

// Google Oauth
const gAuth = require("./auth/google.js");

const app = express();

app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Google Auth setup
app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", gAuth);

// define API routing information
app.use("/api/pot", potRoute);
// app.use("/api/user", userRoute);
app.use("/api/plant", plantRoute);
app.use("/api/dev-notifications", devNotifications);

app.get("/", (req, res) =>
  res.send("<h1 style='text-align: center'>CHANOS Webserver API</h1> <a href='/api/auth/google'>Login with Google</a>")
);

module.exports = app;
