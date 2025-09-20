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

export const getComplaints = () => API.get("/reports/all");
export const getUserComplaints = (userId) => API.get(`/reports/user/${userId}`);
// Update complaint status (admin)
export const updateComplaintStatus = (complaintId, status) =>
  API.patch(`/complaints/${complaintId}/status`, { status });

export const submitListing = (data) => API.post("/listings", data);

// AI - Waste Classification
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

export const getListings = () => API.get("/listings");
export const acceptListing = (listingId, dealerId) =>
  API.post(`/listings/${listingId}/accept`, { dealerId });


// USER STATS + ACTIVITY
export const getUserStats = () => API.get("/users/stats"); // ✅ NEW
export const getRecentActivity = () => API.get("/users/activity"); // ✅ NEW

export default API;