const plantService = require("../services/plant.service");

const newPlant = async (req, res) => {
  // const user_id = req.body.user_id; // TODO: integrate users
  const name = req.body.name;
  const watering_timer_useconds = req.body.watering_timer_useconds;
  const sampling_period = req.body.sampling_period;
  const maximum_moisture_level = req.body.maximum_moisture_level;
  const minimum_moisture_level = req.body.minimum_moisture_level;
  const smv_percentage = req.body.smv_percentage;
  const maximum_sunlight = req.body.maximum_sunlight;

  const results = await plantService.createPlant(
    // user_id,
    name,
    watering_timer_useconds,
    sampling_period,
    maximum_moisture_level,
    minimum_moisture_level,
    smv_percentage,
    maximum_sunlight
  );
  res.status(200).json(results);
};

/*
const newPlantFromExisting = async (req, res) => {
  // const user_id = req.body.user_id; // TODO: integrate users
  // const parent_id = req.body.parent_id;
  const name = req.body.name;
  const watering_timer_useconds = req.body.watering_timer_useconds;
  const sampling_period = req.body.sampling_period;
  const maximum_moisture_level = req.body.maximum_moisture_level;
  const minimum_moisture_level = req.body.minimum_moisture_level;
  const smv_percentage = req.body.smv_percentage;
  const maximum_sunlight = req.body.maximum_sunlight;

  const results = await plantService.createPlantFromExisting(
    // user_id,
    // parent_id,
    name,
    watering_timer_useconds,
    sampling_period,
    maximum_moisture_level,
    minimum_moisture_level,
    smv_percentage,
    maximum_sunlight
  );
  res.status(200).json(results);
};
*/

const getPlant = async (req, res) => {
  const uuid = req.params.uuid;

  const results = await plantService.getPlantByUUID(uuid);
  res.status(200).json(results);
};

const getAllPlants = async (req, res) => {
  const results = await plantService.getAllPlants();
  res.status(200).json(results);
};

module.exports = {
  newPlant,
  getPlant,
  getAllPlants
};
