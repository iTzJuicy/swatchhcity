import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

import '../styles/pages/mycomplaints.css';

function MyComplaints() {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    /*useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await getMyComplaints();
        setComplaints(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    */
    //  Dummy data until backend is ready
    setTimeout(() => {
      setComplaints([
        {
          _id: "abc123456",
          description: "Overflowing garbage near school",
          status: "Pending",
          category: "Solid Waste",
          lat: 12.9716,
          lng: 77.5946,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "xyz987654",
          description: "Uncollected waste in street",
          status: "Resolved",
          category: "Plastic Waste",
          address: "MG Road, Bangalore",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
      case 'in progress': return 'fas fa-cog fa-spin';
      case 'resolved': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-clock';
    }
  };

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  const statusCounts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status.toLowerCase() === 'pending').length,
    'in progress': complaints.filter(c => c.status.toLowerCase() === 'in progress').length,
    resolved: complaints.filter(c => c.status.toLowerCase() === 'resolved').length,
    rejected: complaints.filter(c => c.status.toLowerCase() === 'rejected').length,
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
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          {Object.keys(statusCounts).map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-clipboard-list"></i>
          <h3>No complaints found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't submitted any complaints yet. Report an issue to get started!"
              : `No complaints with status: ${filter}`
            }
          </p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map(complaint => (
            <div key={complaint._id} className="complaint-card">
              <div className="card-header">
                <div className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                  <i className={getStatusIcon(complaint.status)}></i>
                  <span>{complaint.status}</span>
                </div>
                <span className="complaint-id">#{complaint._id.slice(-6)}</span>
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
                    <span>Category: {complaint.category}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>
                      Location: {complaint.address || 
                        `${complaint.lat?.toFixed(4)}, ${complaint.lng?.toFixed(4)}`}
                    </span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar-plus"></i>
                    <span>Reported: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>Updated: {new Date(complaint.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="action-buttons">
                  <button className="view-btn">
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  {complaint.status.toLowerCase() === 'resolved' && (
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
    </div>
  );
}

export default MyComplaints;
