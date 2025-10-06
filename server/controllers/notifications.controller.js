const notificationsService = require("../services/notifications.service");

const getNotifications = async (req, res) => {
  const results = await notificationsService.getNotifications();
  res.status(200).json(results);
};

module.exports = {
  getNotifications
};
