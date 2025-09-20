import axios from "axios";

const BASE_URL = "http://localhost:4000/api/routes";

export const getOptimalRoutes = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/optimal`);
    return res.data;
  } catch (err) {
    console.error("Error fetching optimal routes:", err);
    throw err;
  }
};
