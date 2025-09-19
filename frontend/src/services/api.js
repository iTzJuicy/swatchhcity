// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ,
});

// attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const signupUser = (data) => API.post("/users/signup", data);
export const loginUser = (data) => API.post("/users/login", data);


// COMPLAINTS
export const submitComplaint = (data) => API.post("/complaints", data);
export const getComplaints = () => API.get("/complaints");
export const getMyComplaints = () => API.get("/complaints/my"); // 
// Update complaint status (admin)
export const updateComplaintStatus = (complaintId, status) =>
  API.patch(`/complaints/${complaintId}/status`, { status });

// AI
export const classifyWaste = (formData) => API.post("/ai/classify", formData);


// LISTINGS

export const submitListing = (formData) => API.post("/listings", formData);
export const getListings = () => API.get("/listings");
export const acceptListing = (listingId, dealerId) =>
  API.post(`/listings/${listingId}/accept`, { dealerId });


// USER STATS + ACTIVITY
export const getUserStats = () => API.get("/users/stats"); // ✅ NEW
export const getRecentActivity = () => API.get("/users/activity"); // ✅ NEW

export default API;
