const pool = require("../config");

class PotService {
  createPot = async () => {
    const { rows: pots } = await pool.query(
      `INSERT INTO pots
      DEFAULT VALUES
      RETURNING id`
    );
    return pots[0];
  };

  // TODO:
  getAndResetModifiedFlag = async (uuid) => {
    return null;
  };

  setPlantForPot = async (potUUID, plantUUID) => {
    const { rows: pots } = await pool.query(
      `UPDATE pots AS t
      SET plant_id = p.id,
          updated_at = NOW()
      FROM plants AS p
      WHERE t.id = $1
        AND p.id = $2
      RETURNING t.*;`,
      [potUUID, plantUUID]
    );

    return pots[0];
  };

  getPlantData = async (uuid) => {
    const { rows: pots } = await pool.query(
      `SELECT
        p.watering_timer_useconds,
        p.sampling_period,
        p.maximum_moisture_level,
        p.minimum_moisture_level,
        p.smv_percentage,
        p.maximum_sunlight
      FROM plants p
      JOIN pots t ON p.id = t.plant_id
      WHERE t.id = $1`,
      [uuid]
    );

    return pots[0];
  };

  updatePlantMeasurements = async (
    uuid,
    battery_level,
    water_level_is_low,
    current_smv,
    lux_value,
    total_sunlight
  ) => {
    const { rows: pots } = await pool.query(
      `UPDATE pots
      SET battery_level = $2,
          water_level_is_low = $3,
          current_moisture_level = $4,
          lux_value = $5,
          total_sunlight = $6,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;`,
      [uuid, battery_level, water_level_is_low, current_smv, lux_value, total_sunlight]
    );

    console.log("Checking water level");
    if (water_level_is_low === true) {
      console.log("water level is low!");
      const { rows: notifications } = await pool.query(
        `INSERT INTO notifications (user_id, pot_id, header, message)
        VALUES ((
          SELECT user_id FROM pots WHERE id = $1),
          $1, $2, $3)
        ON CONFLICT (user_id, header, pot_id)
        DO UPDATE SET
          message = EXCLUDED.message,
          created_at = NOW()
        RETURNING *;`,
        [uuid, "Pot Water Level is low!", `Your pot ${uuid} is running low on water, please refill the pot now!`]
      );
    }
    else {
      console.log("water level is not low, deleting notification");
      const { rows: notifications } = await pool.query(
        `DELETE FROM notifications
        WHERE pot_id = $1
          AND header = $2
        RETURNING *;`,
        [uuid, "Pot Water Level is low!"]
      );
      if (notifications.length > 0) {
        console.log(`Deleted ${notifications.length} notification(s)`);
      } else {
        console.log("No existing low-water notification found to delete");
      }
    }

    return pots[0];
  };

  getPotByUUID = async (uuid) => {
    const { rows: pots } = await pool.query(
      `SELECT *
      FROM pots
      WHERE id = $1`,
      [uuid]
    );

    return pots[0];
  };

  getAllPots = async () => {
    const { rows: pots } = await pool.query(
      `SELECT *
      FROM pots`
    );

    return pots;
  };

  // TODO: Scrap old notification system
  createNotification = async (uuid, msg) => {
    return null;
  };

  updatePot = async(uuid, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return getPotByUUID(uuid);

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(data);

    const query = `
      UPDATE pots
      SET ${setClauses}, updated_at = now()
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [...values, uuid]);
    return rows[0];
  };
}

module.exports = new PotService();
