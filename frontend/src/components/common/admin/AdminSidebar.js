import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/components/adminsidebar.css";

const AdminSidebar = ({ menuItems, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-recycle"></i>
          <span>SwatchhCity Admin</span>
        </div>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
