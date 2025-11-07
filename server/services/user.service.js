const pool = require("../config/index.js");

class UserService {
  getUserById = async(user_id) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
    return rows[0];
  };

  deleteUserById = async(user_id) => {
    const { rows } = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [user_id]);
    return rows[0];
  };

  getUserPots = async(user_id) => {
    const { rows } = await pool.query(
      `SELECT * FROM pots 
      WHERE user_id = $1 
      ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  };

  getUserPlants = async(user_id) => {
    const { rows } = await pool.query(
      `SELECT * FROM plants 
      WHERE user_id = $1 OR user_id IS NULL
      ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  };

  getUserNotifications = async(user_id) => {
    const { rows } = await pool.query(
      `SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  };

  connectUserToPot = async(user_id, pot_id) => {
    const { rows: potExists } = await pool.query(
      `SELECT * FROM pots
      WHERE id = $1`,
      [pot_id]
    );
    if (potExists.length === 0) { return null };

    const { rows: assigned } = await pool.query(
      `UPDATE pots
      SET user_id = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *`,
      [user_id, pot_id]
    );

    return assigned[0];
  };
}

module.exports = new UserService();
