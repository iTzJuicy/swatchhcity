// src/services/api.js
import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api", // include /api
  withCredentials: true,
});


// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===================== AUTH =====================
export const signupUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ===================== COMPLAINTS =====================
export const submitComplaint = (formData) =>
  API.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyComplaints = () => API.get("/complaints/my");
export const getComplaints = () => API.get("/complaints");

// Update complaint status (admin)
export const updateComplaintStatus = (complaintId, status) =>
  API.patch(`/complaints/${complaintId}/status`, { status });

// ===================== AI / WASTE =====================
// Waste classification (image / form data)
export const classifyWaste = (formData) =>
  API.post("/ai/waste-category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Optional: text-based classification
export const classifyWasteText = (data) =>
  API.post("/ai/classify-text", data);

// ===================== LISTINGS =====================
export const submitListing = (formData) =>
  API.post("/listings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getListings = () => API.get("/listings");

export const acceptListing = (listingId, dealerId) =>
  API.post(`/listings/${listingId}/accept`, { dealerId });

// ===================== USER STATS + ACTIVITY =====================
export const getUserStats = () => API.get("/users/stats");
export const getRecentActivity = () => API.get("/users/activity");
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

;


export default API;
