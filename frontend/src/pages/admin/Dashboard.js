// src/pages/admin/Dashboard.jsx
import React from "react";
import AdminLayout from "../../components/common/admin/AdminLayout";
import "../../styles/pages/admindashboard.css";

const Dashboard = () => {
const menuItems = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: "fas fa-tachometer-alt" },
    { id: 2, title: "Complaints", path: "/admin/complaints", icon: "fas fa-flag" },
    { id: 3, title: "Recycling Opportunities", path: "/admin/dealer-listings", icon: "fas fa-store" },
    { id: 4, title: "Users", path: "/admin/users", icon: "fas fa-users" },
    { id: 5, title: "Zones", path: "/admin/zones", icon: "fas fa-map-marker-alt" },
    { id: 6, title: "Trucks", path: "/admin/trucks", icon: "fas fa-truck" },
    { id: 7, title: "Waste Prediction & Routing", path: "/admin/wastemap", icon: "fas fa-truck" },
    { id: 8, title: "Rewards", path: "/admin/rewards", icon: "fas fa-gift" },
    { id: 9, title: "Reports", path: "/admin/reports", icon: "fas fa-file-alt" },
  ];

  const statsData = [
    { title: "Total Complaints", value: "1,248", icon: "fas fa-flag", change: "+12%", color: "#2E8B57" },
    { title: "Resolved", value: "892", icon: "fas fa-check-circle", change: "+8%", color: "#4682B4" },
    { title: "Pending", value: "356", icon: "fas fa-clock", change: "-3%", color: "#FFD700" },
    { title: "Users", value: "5,742", icon: "fas fa-users", change: "+15%", color: "#20C997" },
  ];

  const recentActivities = [
    { id: 1, action: "New complaint submitted", user: "Rahul Sharma", time: "2 mins ago", type: "complaint" },
    { id: 2, action: "Complaint resolved", user: "Municipal Team", time: "1 hour ago", type: "resolve" },
    { id: 3, action: "User registered", user: "Priya Patel", time: "3 hours ago", type: "user" },
    { id: 4, action: "Report generated", user: "System", time: "5 hours ago", type: "report" },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "complaint": return "fas fa-flag";
      case "resolve": return "fas fa-check-circle";
      case "user": return "fas fa-user-plus";
      case "report": return "fas fa-file-alt";
      default: return "fas fa-bell";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "complaint": return "#2E8B57";
      case "resolve": return "#4682B4";
      case "user": return "#FFD700";
      case "report": return "#20C997";
      default: return "#6c757d";
    }
  };

  return (
    <AdminLayout menuItems={menuItems}>
      {/* Stats Grid */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
              <i className={stat.icon} style={{ color: stat.color }}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className={`stat-change ${stat.change.includes('+') ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Complaints Overview</h3>
            <select className="chart-filter">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="placeholder-chart">
              <i className="fas fa-chart-bar"></i>
              <p>Complaints Analytics Chart</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>User Activity</h3>
            <select className="chart-filter">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="placeholder-chart">
              <i className="fas fa-chart-pie"></i>
              <p>User Activity Chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <div className="activities-header">
          <h3>Recent Activities</h3>
        </div>
        
        <div className="activities-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: `${getActivityColor(activity.type)}20` }}>
                <i className={getActivityIcon(activity.type)} style={{ color: getActivityColor(activity.type) }}></i>
              </div>
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <span className="activity-user">by {activity.user}</span>
              </div>
              <span className="activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stats-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <i className="fas fa-plus"></i>
              <span>Add User</span>
            </button>
            <button className="quick-action-btn">
              <i className="fas fa-download"></i>
              <span>Export Data</span>
            </button>
            <button className="quick-action-btn">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
            <button className="quick-action-btn">
              <i className="fas fa-question-circle"></i>
              <span>Help</span>
            </button>
          </div>
        </div>

        <div className="stats-card">
          <h3>System Status</h3>
          <div className="system-status">
            <div className="status-item">
              <span className="status-label">Server Uptime</span>
              <span className="status-value">99.9%</span>
            </div>
            <div className="status-item">
              <span className="status-label">API Response</span>
              <span className="status-value">128ms</span>
            </div>
            <div className="status-item">
              <span className="status-label">Active Sessions</span>
              <span className="status-value">42</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
