const userService = require("../services/user.service.js");

getUser = async(req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

deleteUser = async(req, res) => {
  try {
    const deleted = await userService.deleteUserById(req.user.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.clearCookie("token");
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

getUserPots = async(req, res) => {
  try {
    const pots = await userService.getUserPots(req.user.id);
    res.json(pots);
  } catch (err) {
    console.error("Error fetching user pots:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

getUserPlants = async(req, res) => {
  try {
    const plants = await userService.getUserPlants(req.user.id);
    res.json(plants);
  } catch (err) {
    console.error("Error fetching user plants:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

getUserNotifications = async(req, res) => {
  try {
    const notifications = await userService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const connectUserToPot = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { pot_id } = req.body;
    if (!pot_id) {
      return res.status(400).json({ error: "Missing pot_id" });
    }

    const updatedPot = await userService.connectUserToPot(user_id, pot_id);
    if (!updatedPot) {
      return res.status(404).json({ error: "Pot not found" });
    }

    res.json({ status: "success", pot: updatedPot });
  } catch (err) {
    console.error("Error connecting user to pot:", err);
    res.status(500).json({ status: "failed", error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  deleteUser,
  getUserPots,
  getUserPlants,
  getUserNotifications,
  connectUserToPot,
};
