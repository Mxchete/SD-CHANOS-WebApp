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
        `INSERT INTO notifications (user_id, header, message)
        VALUES ((
          SELECT user_id FROM pots WHERE id = $1),
          $2, $3)
        ON CONFLICT (user_id, header)
        DO UPDATE SET
          message = EXCLUDED.message,
          created_at = NOW()
        RETURNING *;`,
        [uuid, "Pot Water Level is low!", "One of your pots has a low water level!"]
      );
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
}

module.exports = new PotService();
