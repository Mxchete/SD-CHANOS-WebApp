// API for the pot to interact with the server
const router = require("express").Router();
const {
  newPlant,
  getPlant,
  getAllPlants
} = require("../controllers/plant.controller");

// Create New plant
router.post("/new", newPlant);

// Get plant by UUID
// @param: UUID - Plant UUID
router.get("/get/:uuid", getPlant);

// Get all plants
router.get("/get", getAllPlants);

module.exports = router;
