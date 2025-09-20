// src/pages/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { getUserStats, getRecentActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../styles/pages/userdashboard.css';

function UserDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
    points: 0,
    rewards: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        getUserStats(),
        getRecentActivity()
      ]);

      const data = statsResponse.data;

      setStats({
        totalComplaints: data.totalReports || 0, // Change to totalReports
        resolved: data.statuses?.resolved || 0, // Map from statuses object
        inProgress: data.statuses?.in_progress || 0, // Map from statuses object
        pending: data.statuses?.pending || 0, // Map from statuses object
        points: data.pointsEarned || 0, // Adjust if points are implemented
        rewards: data.rewards || 0 // Adjust if rewards are implemented
      });

      setRecentActivity(activityResponse.data.slice(0, 5));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const getProgressPercentage = () => {
    return stats.totalComplaints ? (stats.resolved / stats.totalComplaints) * 100 : 0;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {currentUser.name}! 👋</h1>
          <p>Here's your impact on keeping the city clean</p>
        </div>
        <div className="header-actions">
          <Link to="/report" className="action-btn primary">
            <i className="fas fa-plus"></i>
            Report New Issue
          </Link>
          <Link to="/list-waste" className="action-btn secondary">
            <i className="fas fa-recycle"></i>
            List Waste
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <h3>Total Complaints</h3>
            <p className="stat-number">{stats.totalComplaints}</p>
            <p className="stat-label">Issues reported</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon resolved">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolved}</p>
            <p className="stat-label">Issues fixed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">
            <i className="fas fa-cog"></i>
          </div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
            <p className="stat-label">Being addressed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon points">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>Points Earned</h3>
            <p className="stat-number">{stats.points}</p>
            <p className="stat-label">Reward points</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="progress-section">
          <div className="section-header">
            <h3>Resolution Progress</h3>
            <span className="progress-percentage">
              {getProgressPercentage().toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                '--progress': `${getProgressPercentage()}%`,
                '--progress-color': getProgressColor(getProgressPercentage())
              }}
            >
              <div className="progress-filled"></div>
            </div>
          </div>
          <div className="progress-stats">
            <span>{stats.resolved} resolved</span>
            <span>{stats.totalComplaints - stats.resolved} remaining</span>
          </div>
        </div>

        <div className="recent-activity">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <Link to="/complaints" className="view-all-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-icon">
                    <i className={`fas ${activity.type === 'complaint' ? 'fa-exclamation-circle' : 'fa-recycle'}`}></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`activity-status ${activity.status}`}>
                    {activity.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-activity">
                <i className="fas fa-history"></i>
                <p>No recent activity</p>
                <span>Your actions will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons-grid">
          <Link to="/report" className="quick-action-btn">
            <i className="fas fa-flag"></i>
            <span>Report Issue</span>
          </Link>
          <Link to="/complaints" className="quick-action-btn">
            <i className="fas fa-list"></i>
            <span>My Complaints</span>
          </Link>
          <Link to="/rewards" className="quick-action-btn">
            <i className="fas fa-gift"></i>
            <span>Rewards</span>
          </Link>
          <Link to="/list-waste" className="quick-action-btn">
            <i className="fas fa-trash-alt"></i>
            <span>List Waste</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;