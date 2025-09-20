import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  getUserComplaints,
  getUserStats,
  getRecentActivity,
} from "../services/api";

import "../styles/pages/mycomplaints.css";

function MyComplaints() {
  const { currentUser } = useAuth(); // token is already attached via interceptor
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?._id) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch complaints
        const complaintsRes = await getUserComplaints(currentUser._id);
        setComplaints(complaintsRes.data || []);

        // Fetch user stats
        const statsRes = await getUserStats();
        setStats(statsRes.data);

        // Fetch recent activity
        const activityRes = await getRecentActivity();
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "in progress":
        return "status-in-progress";
      case "resolved":
        return "status-resolved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "fas fa-clock";
      case "in progress":
        return "fas fa-cog fa-spin";
      case "resolved":
        return "fas fa-check-circle";
      case "rejected":
        return "fas fa-times-circle";
      default:
        return "fas fa-clock";
    }
  };

  const filteredComplaints =
    filter === "all"
      ? complaints
      : complaints.filter(
          (c) => c.status.toLowerCase() === filter.toLowerCase()
        );

  const statusCounts = {
    all: complaints.length,
    pending: complaints.filter((c) => c.status.toLowerCase() === "pending")
      .length,
    "in progress": complaints.filter(
      (c) => c.status.toLowerCase() === "in progress"
    ).length,
    resolved: complaints.filter((c) => c.status.toLowerCase() === "resolved")
      .length,
    rejected: complaints.filter((c) => c.status.toLowerCase() === "rejected")
      .length,
  };

  if (loading) {
    return (
      <div className="complaints-container">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <div className="header-content">
          <h2>My Complaints</h2>
          <p>Track the status of your reported issues</p>
        </div>

        <div className="complaint-stats">
          <div className="stat-item">
            <span className="stat-number">{complaints.length}</span>
            <span className="stat-label">Total Complaints</span>
          </div>
          {stats && (
            <>
              <div className="stat-item">
                <span className="stat-number">{stats.resolvedComplaints}</span>
                <span className="stat-label">Resolved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.pendingComplaints}</span>
                <span className="stat-label">Pending</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          {Object.keys(statusCounts).map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-clipboard-list"></i>
          <h3>No complaints found</h3>
          <p>
            {filter === "all"
              ? "You haven't submitted any complaints yet. Report an issue to get started!"
              : `No complaints with status: ${filter}`}
          </p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="card-header">
                <div
                  className={`status-badge ${getStatusBadgeClass(
                    complaint.status
                  )}`}
                >
                  <i className={getStatusIcon(complaint.status)}></i>
                  <span>{complaint.status}</span>
                </div>
                <span className="complaint-id">
                  #{complaint._id.slice(-6)}
                </span>
              </div>

              {complaint.image && (
                <div className="complaint-image">
                  <img src={complaint.image} alt="Complaint evidence" />
                </div>
              )}

              <div className="card-body">
                <h4 className="complaint-description">
                  {complaint.description}
                </h4>

                <div className="complaint-details">
                  {complaint.category && (
                    <div className="detail-item">
                      <i className="fas fa-tag"></i>
                      <span>Category: {complaint.category}</span>
                    </div>
                  )}
                  {complaint.address ||
                  (complaint.lat && complaint.lng) ? (
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>
                        Location:{" "}
                        {complaint.address ||
                          `${complaint.lat?.toFixed(4)}, ${complaint.lng?.toFixed(
                            4
                          )}`}
                      </span>
                    </div>
                  ) : null}
                  <div className="detail-item">
                    <i className="fas fa-calendar-plus"></i>
                    <span>
                      Reported:{" "}
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>
                      Updated:{" "}
                      {new Date(complaint.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="action-buttons">
                  <button className="view-btn">
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  {complaint.status.toLowerCase() === "resolved" && (
                    <button className="rate-btn">
                      <i className="fas fa-star"></i>
                      Rate Resolution
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Optional: show activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {activity.length === 0 ? (
          <p>No recent activity found.</p>
        ) : (
          <ul>
            {activity.map((a, i) => (
              <li key={i}>
                <i className="fas fa-history"></i>{" "}
                {a.type} {a.action} on{" "}
                {new Date(a.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
