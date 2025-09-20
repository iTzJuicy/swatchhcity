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
export const updateComplaintStatus = (id, status) =>
  API.patch(`/reports/${id}/status`, { status });

export const submitListing = (data) => API.post("/recycle", data);
export const getRecycleListing = () => API.get("/recycle");


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

export const getUserRewards = (userId) => API.get(`/rewards/user/${userId}`);



// ===================== ZONES =====================
export const getZones = () => API.get("/zones");
export const createZone = (zoneData) => API.post("/zones", zoneData);
export const updateZone = (zoneId, zoneData) => API.put(`/zones/${zoneId}`, zoneData);
export const deleteZone = (zoneId) => API.delete(`/zones/${zoneId}`);


// ===================== TRUCKS =====================
export const getTrucks = () => API.get("/trucks");
export const createTruck = (truckData) => API.post("/trucks", truckData);
export const updateTruck = (truckId, truckData) => API.put(`/trucks/${truckId}`, truckData);
export const deleteTruck = (truckId) => API.delete(`/trucks/${truckId}`);

// Fetch optimal truck routes
export const getOptimalRoutes = () => API.get("/routes/optimal");

export default API;