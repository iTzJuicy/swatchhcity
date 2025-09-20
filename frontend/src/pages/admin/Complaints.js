import React, { useEffect, useState } from "react";
import { getComplaints, updateComplaintStatus } from "../../services/api";
import { toast } from "react-toastify";
import AdminLayout from "../../components/common/admin/AdminLayout";
import "../../styles/pages/admincomplaints.css";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Sidebar menu items
  const menuItems = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: "fas fa-tachometer-alt" },
    { id: 2, title: "Complaints", path: "/admin/complaints", icon: "fas fa-flag" },
    { id: 3, title: "Recycling Opportunities", path: "/admin/dealer-listings", icon: "fas fa-store" },
    { id: 4, title: "Users", path: "/admin/users", icon: "fas fa-users" },
    { id: 5, title: "Rewards", path: "/admin/rewards", icon: "fas fa-gift" },
    { id: 6, title: "Reports", path: "/admin/reports", icon: "fas fa-file-alt" },
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getComplaints();
      setComplaints(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    try {
      await updateComplaintStatus(complaintId, newStatus);
      setComplaints(prev => prev.map(c => 
        c._id === complaintId ? { ...c, status: newStatus } : c
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'in progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'fas fa-clock';
      case 'in progress': return 'fas fa-cog';
      case 'resolved': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-clock';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === "all" || complaint.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status.toLowerCase() === 'pending').length,
    'in progress': complaints.filter(c => c.status.toLowerCase() === 'in progress').length,
    resolved: complaints.filter(c => c.status.toLowerCase() === 'resolved').length,
    rejected: complaints.filter(c => c.status.toLowerCase() === 'rejected').length,
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout menuItems={menuItems}>
        <div className="admin-complaints-container">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading complaints...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-complaints-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <h1>Complaints Management</h1>
            <p>Manage and track all reported issues</p>
          </div>
          <button onClick={fetchComplaints} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon total"><i className="fas fa-clipboard-list"></i></div>
            <div className="stat-content">
              <h3>Total Complaints</h3>
              <p className="stat-number">{complaints.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending"><i className="fas fa-clock"></i></div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-number">{statusCounts.pending}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress"><i className="fas fa-cog"></i></div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-number">{statusCounts['in progress']}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon resolved"><i className="fas fa-check-circle"></i></div>
            <div className="stat-content">
              <h3>Resolved</h3>
              <p className="stat-number">{statusCounts.resolved}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            {["all", "pending", "in progress", "resolved", "rejected"].map(f => (
              <button 
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <h3>No complaints found</h3>
            <p>
              {searchTerm 
                ? "No complaints match your search criteria"
                : "There are no complaints to display"}
            </p>
          </div>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map(complaint => (
              <div key={complaint._id} className="complaint-card">
                <div className="card-header">
                  <div className="complaint-id">#{complaint._id.slice(-6)}</div>
                  <div className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                    <i className={getStatusIcon(complaint.status)}></i>
                    <span>{complaint.status}</span>
                  </div>
                </div>

                {complaint.image && (
                  <div className="complaint-image">
                    <img src={complaint.image} alt="Complaint evidence" />
                  </div>
                )}

                <div className="card-body">
                  <h4 className="complaint-description">{complaint.description}</h4>
                  <div className="complaint-details">
                    <div className="detail-item">
                      <i className="fas fa-tag"></i>
                      <span><strong>Category:</strong> {complaint.category}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>
                        <strong>Location:</strong> {complaint.address || 
                          `${complaint.lat?.toFixed(4)}, ${complaint.lng?.toFixed(4)}`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <span><strong>Reported by:</strong> {complaint.userId?.name || 'Unknown'}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar-plus"></i>
                      <span><strong>Reported:</strong> {new Date(complaint.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar-check"></i>
                      <span><strong>Updated:</strong> {new Date(complaint.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="status-actions">
                    <label>Update Status:</label>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      disabled={updatingId === complaint._id}
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {updatingId === complaint._id && (
                      <i className="fas fa-spinner fa-spin updating-spinner"></i>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button className="view-btn"><i className="fas fa-eye"></i> View Details</button>
                    <button className="assign-btn"><i className="fas fa-user-plus"></i> Assign</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}