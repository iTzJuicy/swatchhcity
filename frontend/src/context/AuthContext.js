import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api"; // make sure this is the Axios instance
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // ===================== SIGNUP =====================
const signup = async (name, email, password) => {
  try {
    const res = await API.post("/auth/register", { name, email, password });

    // handle both { user, token } or { _id, name, email, token }
    const user = res.data.user || {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      points: res.data.points || 0, // default in case backend doesn't send
    };

    setCurrentUser(user);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Account created successfully! 🎉");
    return user;
  } catch (err) {
    toast.error(err.response?.data?.message || "Signup failed ❌");
    throw err;
  }
};

// ===================== LOGIN =====================
const login = async (email, password) => {
  try {
    const res = await API.post("/auth/login", { email, password });

    const user = res.data.user || {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      points: res.data.points || 0,
    };

    setCurrentUser(user);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Logged in successfully! 🚀");
    return user;
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed ❌");
    throw err;
  }
};

  // ===================== LOGOUT =====================
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out 📴");
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
