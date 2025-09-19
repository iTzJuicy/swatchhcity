import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = (data) => API.post("/users/signup", data);
export const loginUser = (data) => API.post("/users/login", data);
export const submitComplaint = (data) => API.post("/complaints", data);
export const getComplaints = () => API.get("/complaints");

export default API;
