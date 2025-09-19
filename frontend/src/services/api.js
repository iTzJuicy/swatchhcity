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

export const classifyWaste = (formData) => {
  return API.post("/ai/waste-category", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const submitComplaint = (formData) => {
  return API.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getComplaints = () => API.get("/complaints");



export default API;
