const potService = require("../services/pot.service");

// Called by ESP to connect a pot to the DB, generates a new DB object w/ UUID
// Used by pot
const getNewUUID = async (req, res) => {
  const results = await potService.createPot();
  res.status(200).json(results);
};

// TODO: Currently this is not implemented by the pot or the server
// Used by pot
const getModifiedValidation = async (req, res) => {
  const uuid = req.params;

  const results = await potService.getAndResetModifiedFlag(uuid);
  res.status(200).json(results);
};

// Connect a pot to a specific set of plant data
// Used by webapp
const setPlantForPot = async (req, res) => {
  const uuid = req.params.uuid;
  const plant_uuid = req.body.plant_uuid;

  const results = await potService.setPlantForPot(uuid, plant_uuid);
  res.status(200).json(results);
};

// Get data of plant connected to pot
// Used by pot and webapp
const getPlantData = async (req, res) => {
  const uuid = req.params.uuid;

  const results = await potService.getPlantData(uuid);
  res.status(200).json(results);
};

// Update measurements from pot
// Used by pot
const sendMeasurements = async (req, res) => {
  // pot UUID
  const uuid = req.params.uuid;

  // Info to be sent to DB
  const battery_level = req.body.battery_level;
  const water_level_is_low = req.body.water_level_is_low;
  const current_smv = req.body.current_moisture_level;
  const lux_value = req.body.lux_value;
  const total_sunlight = req.body.total_sunlight;

  const results = await potService.updatePlantMeasurements(
    uuid,
    battery_level,
    water_level_is_low,
    current_smv,
    lux_value,
    total_sunlight
  );
  res.status(200).json(results);
};

const getPot = async (req, res) => {
  const uuid = req.params.uuid;

  const results = await potService.getPotByUUID(uuid);
  res.status(200).json(results);
};

const getAllPots = async (req, res) => {
  const results = await potService.getAllPots();
  res.status(200).json(results);
};

// TODO: Refactor notifications to be created based on Measurement values sent
const sendNotification = async (req, res) => {
  const uuid = req.params;
  const { msg_header, msg_body } = req.body;

  const results = await potService.createNotification(uuid, {msg_header, msg_body});
  res.status(200).json(results);
};

module.exports = {
  getNewUUID,
  getModifiedValidation,
  // setModifiedValidation,
  setPlantForPot,
  getPlantData,
  sendMeasurements,
  sendNotification,
  getPot,
  getAllPots
};
