import axios from "axios";

const url = "http://localhost:4000";

const baseURL = `${url}/api/`;

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

export const updatePot = async (uuid, data) => {
  try {
    const res = await axios.post(`${baseURL}${potURL}update/${uuid}`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating pot:", error);
    return null;
  }
};

export const uploadPotImage = async (uuid, formData) => {
  try {
    const res = await axios.post(
      `${baseURL}${potURL}upload-image/${uuid}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error uploading pot image:", err);
    throw err;
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

const authURL = "auth/";

export const loginWithGoogle = async (credential) => {
  try {
    const res = await axios.post(`${baseURL}${authURL}google/verify`, 
      { credential }, 
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Google token verification failed:", error);
    return null;
  }
};

const userURL = "user/";

export const getUserProfile = async () => {
  try {
    const res = await axios.get(`${baseURL}${userURL}get`, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getUserPots = async () => {
  try {
    const res = await axios.get(`${baseURL}${userURL}getPots`, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getUserPlants = async () => {
  try {
    const res = await axios.get(`${baseURL}${userURL}getPlants`, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getPotImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${url}${imagePath}`;
};
