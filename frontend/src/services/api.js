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
// **AI APIs**
export const classifyWaste = (formData) => API.post("/ai/classify", formData);
// Listings APIs
export const submitListing = (formData) => API.post("/listings", formData);
export const getListings = () => API.get("/listings");
export const acceptListing = (listingId, dealerId) => API.post(`/listings/${listingId}/accept`, { dealerId });

export default API;
