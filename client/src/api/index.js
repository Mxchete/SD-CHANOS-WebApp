import axios from "axios";

const baseURL = "http://localhost:4000/api/";

// Pot API interactions
const potURL = "pot/";

// Route to /api/pot/get
export const getAllPots = async () => {
  try {
    const res = await axios.get(`${baseURL}${potURL}get`);
    console.log('pots res:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching pots:', error);
    return null;
  }
};

// Route to /api/pot/get/:uuid
export const getPot = async (uuid) => {
  try {
    const res = await axios.get(`${baseURL}${pot}get/${uuid}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

// Route to /api/pot/setPlantUUID/:uuid
export const setPlantUUID = async (uuid, data) => {
  try {
    const res = await axios.get(`${baseURL}${pot}setPlantUUID/${uuid}`, data);
    return res.data;
  } catch (error) {
    return null;
  }
};
