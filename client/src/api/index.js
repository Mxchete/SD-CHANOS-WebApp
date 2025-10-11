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
    const res = await axios.get(`${baseURL}${potURL}get/${uuid}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

// Route to /api/pot/setPlantUUID/:uuid
export const setPlantUUID = async (uuid, data) => {
  try {
    const res = await axios.post(`${baseURL}${potURL}setPlantUUID/${uuid}`, data);
    console.log(res);
    return res.data;
  } catch (error) {
    return null;
  }
};

// Plant API interactions
const plantURL = "plant/";

// Route to /api/plant/get
export const getAllPlants = async () => {
  try {
    const res = await axios.get(`${baseURL}${plantURL}get`);
    return res.data;
  } catch (error) {
    return null;
  }
};

// Route to /api/plant/get/:uuid
export const getPlant = async (uuid) => {
  try {
    const res = await axios.get(`${baseURL}${plantURL}get/${uuid}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

// Route to /api/plant/new
export const addPlant = async (data) => {
  try {
    const res = await axios.post(`${baseURL}${plantURL}new`, data);
    return res.data;
  } catch (error) {
    return null;
  }
};

// Plant API interactions
const notiURL = "dev-notifications/";

// Route to /api/dev-notifications
export const getNotis = async () => {
  try {
    const res = await axios.get(`${baseURL}${notiURL}`);
    return res.data;
  } catch (error) {
    return null;
  }
};
