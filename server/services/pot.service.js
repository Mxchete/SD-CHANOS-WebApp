const pool = require("../config");
const { handlePotNotifications } = require("../middleware/notifications");

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

    await handlePotNotifications(uuid, battery_level, water_level_is_low, total_sunlight);

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
