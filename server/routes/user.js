// API for the user accounts
const {requireAuth} = require("../middleware/auth");
const router = require("express").Router();
const {
  getUser,
  deleteUser,
  getUserPots,
  getUserPlants,
  getUserNotifications,
  connectUserToPot
} = require("../controllers/user.controller");

router.get("/get", requireAuth, getUser);

router.delete("/del", requireAuth, deleteUser);

router.get("/getPots", requireAuth, getUserPots);

router.get("/getPlants", requireAuth, getUserPlants);

router.get("/getNotifs", requireAuth, getUserNotifications);

router.post("/connectPot", requireAuth, connectUserToPot);

module.exports = router;
