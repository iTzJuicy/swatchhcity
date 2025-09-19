import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../services/api";
import { toast } from "react-toastify";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let user = null;

  try {
    if (userString) user = JSON.parse(userString);
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    localStorage.removeItem("user"); // clean bad value
  }

  if (token && user) setCurrentUser(user);
  setLoading(false);
}, []);

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      setCurrentUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Account created successfully! ");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed ");
      throw err;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      setCurrentUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Logged in successfully! ");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ");
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out ");
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
