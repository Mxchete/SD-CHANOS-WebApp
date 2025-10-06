const pool = require("../config");

class NotificationsService {
  getNotifications = async () => {
    const { rows: notis } = await pool.query(
      `SELECT *
      FROM notifications`
    );

    return notis;
  };
}

module.exports = new NotificationsService();
