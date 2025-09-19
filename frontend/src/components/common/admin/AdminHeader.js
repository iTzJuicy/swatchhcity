import React from "react";
import "../../../styles/components/adminheader.css";

const AdminHeader = ({ toggleSidebar }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="header-right">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>

        <div className="header-actions">
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>

          <button className="profile-btn">
            <div className="profile-avatar-sm">
              <i className="fas fa-user-shield"></i>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
