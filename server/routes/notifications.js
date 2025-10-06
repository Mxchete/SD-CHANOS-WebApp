// API for the pot to interact with the server
const router = require("express").Router();
const {
  getNotifications
} = require("../controllers/notifications.controller");

router.get("/", getNotifications);

module.exports = router;
