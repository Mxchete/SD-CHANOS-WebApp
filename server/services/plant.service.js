const pool = require("../config");

class PlantService {
  createPlant = async (
    user_id,
    name,
    watering_timer_useconds,
    sampling_period,
    maximum_moisture_level,
    minimum_moisture_level,
    smv_percentage,
    maximum_sunlight
  ) => {
    const { rows: plants } = await pool.query(
      `INSERT INTO plants
        (user_id,
        name,
        watering_timer_useconds,
        sampling_period,
        maximum_moisture_level,
        minimum_moisture_level,
        smv_percentage,
        maximum_sunlight) 
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [user_id, name, watering_timer_useconds, sampling_period, maximum_moisture_level, minimum_moisture_level, smv_percentage, maximum_sunlight]
    );
    return plants[0];
  };

  getPlantByUUID = async (uuid) => {
    const { rows: plants } = await pool.query(
      `SELECT *
      FROM plants
      WHERE id = $1`,
      [uuid]
    );

    return plants[0];
  };

  getAllPlants = async () => {
    const { rows: plants } = await pool.query(
      `SELECT *
      FROM plants`
    );

    return plants;
  };
}

module.exports = new PlantService();
