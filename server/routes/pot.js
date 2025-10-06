// API for the pot to interact with the server
const router = require("express").Router();
const {
  getNewUUID,
  getModifiedValidation,
  setPlantForPot,
  getPlantData,
  sendMeasurements,
  sendNotification,
  getPot,
  getAllPots
} = require("../controllers/pot.controller");

router.get("/get", getAllPots);

router.get("/get/:uuid", getPot);

// Generate unique UUID for this pot
router.get("/genUUID", getNewUUID);

// Flag to see if static plant data was modified
// @param: UUID - Pot UUID
router.get("/modified/:uuid", getModifiedValidation);

// Give pot a plant uuid
// @param: UUID - Pot UUID
router.post("/setPlantUUID/:uuid", setPlantForPot);

// Get plant data from server
// @param: UUID - Pot UUID
router.get("/plantdata/:uuid", getPlantData);

// Route for pot to use when sending data measurements
// @param: UUID - Pot UUID
router.post("/measurements/:uuid", sendMeasurements);

// notification message handler
// @param: UUID - Pot UUID
router.get("/notification/:uuid", sendNotification);

module.exports = router;
