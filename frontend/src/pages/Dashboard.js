import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {currentUser && <p>Hello, {currentUser.name || currentUser.email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
