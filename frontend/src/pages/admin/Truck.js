import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/common/admin/AdminLayout";
import { getTrucks, createTruck, updateTruck, deleteTruck } from "../../services/api";

import "../../styles/pages/admintrucks.css";

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTruck, setNewTruck] = useState({ 
    name: "", 
    licensePlate: "", 
    capacity: 0,
    currentLoad: 0,
    status: "available"
  });
  const [editingTruck, setEditingTruck] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState("all");

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

  useEffect(() => { 
    fetchTrucks(); 
  }, []);
const fetchTrucks = async () => {
  setLoading(true);
  try {
    const response = await getTrucks(); // Axios response
    setTrucks(response.data);           // <-- Use response.data, not just response
  } catch (err) {
    console.error("Error fetching trucks:", err);
    alert("Failed to fetch trucks");
  }
  setLoading(false);
};


  const handleCreate = async () => {
    if (!newTruck.name) return alert("Truck name is required");
    if (!newTruck.licensePlate) return alert("License plate is required");
    if (newTruck.capacity <= 0) return alert("Capacity must be greater than 0");
    
    try {
      await createTruck(newTruck);
      setNewTruck({ name: "", licensePlate: "", capacity: 0, currentLoad: 0, status: "available" });
      setShowCreateForm(false);
      fetchTrucks();
      alert("Truck created successfully!");
    } catch (err) {
      console.error("Error creating truck:", err);
      alert("Failed to create truck");
    }
  };

  const handleUpdate = async (truck) => {
    try {
      await updateTruck(truck._id, truck);
      setEditingTruck(null);
      fetchTrucks();
      alert("Truck updated successfully!");
    } catch (err) {
      console.error("Error updating truck:", err);
      alert("Failed to update truck");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this truck?")) {
      try {
        await deleteTruck(id);
        fetchTrucks();
        alert("Truck deleted successfully!");
      } catch (err) {
        console.error("Error deleting truck:", err);
        alert("Failed to delete truck");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available": return "fas fa-check-circle";
      case "on-route": return "fas fa-truck-moving";
      case "maintenance": return "fas fa-tools";
      case "full": return "fas fa-ban";
      default: return "fas fa-question-circle";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "#2E8B57";
      case "on-route": return "#4682B4";
      case "maintenance": return "#FFD700";
      case "full": return "#DC3545";
      default: return "#6c757d";
    }
  };

  const getLoadPercentage = (truck) => {
    return truck.capacity > 0 ? (truck.currentLoad / truck.capacity) * 100 : 0;
  };

  const getLoadLevel = (percentage) => {
    if (percentage >= 90) return "high";
    if (percentage >= 60) return "medium";
    return "low";
  };

 const filteredTrucks = trucks.filter(truck => {
  if (filter === "all") return true;
  if (filter === "available") return truck.status === "available";
  if (filter === "on-route") return truck.status === "on-route";
  if (filter === "maintenance") return truck.status === "maintenance";
  if (filter === "full") return truck.status === "full";
  return true;
});


  if (loading) return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-page-container">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading trucks...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-page-container">
        <div className="admin-header">
          <div className="header-content">
            <h1>Truck Management</h1>
            <p>Manage waste collection trucks and monitor their status</p>
          </div>
          <button onClick={fetchTrucks} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="trucks-statistics">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-truck"></i>
            </div>
            <div className="stat-content">
              <h3>{trucks.length}</h3>
              <p>Total Trucks</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon available">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{trucks.filter(t => t.status === 'available').length}</h3>
              <p>Available</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon on-route">
              <i className="fas fa-truck-moving"></i>
            </div>
            <div className="stat-content">
              <h3>{trucks.filter(t => t.status === 'on-route').length}</h3>
              <p>On Route</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon maintenance">
              <i className="fas fa-tools"></i>
            </div>
            <div className="stat-content">
              <h3>{trucks.filter(t => t.status === 'maintenance').length}</h3>
              <p>Maintenance</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="trucks-controls">
          <div className="filter-buttons">
  <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All Trucks</button>
  <button className={`filter-btn ${filter === "available" ? "active" : ""}`} onClick={() => setFilter("available")}>Available</button>
  <button className={`filter-btn ${filter === "on-route" ? "active" : ""}`} onClick={() => setFilter("on-route")}>On Route</button>
  <button className={`filter-btn ${filter === "maintenance" ? "active" : ""}`} onClick={() => setFilter("maintenance")}>Maintenance</button>
  <button className={`filter-btn ${filter === "full" ? "active" : ""}`} onClick={() => setFilter("full")}>Full</button>
</div>

          
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-truck-btn"
          >
            <i className="fas fa-plus"></i>
            {showCreateForm ? "Cancel" : "Add New Truck"}
          </button>
        </div>

        {/* Create Truck Form */}
        {showCreateForm && (
          <div className="create-truck-form">
            <h3>Add New Truck</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Truck Name</label>
                <input
                  type="text"
                  placeholder="Enter truck name"
                  value={newTruck.name}
                  onChange={e => setNewTruck({ ...newTruck, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  placeholder="Enter license plate"
                  value={newTruck.licensePlate}
                  onChange={e => setNewTruck({ ...newTruck, licensePlate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Capacity (kg)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Capacity in kg"
                  value={newTruck.capacity}
                  onChange={e => setNewTruck({ ...newTruck, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Current Load (kg)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Current load in kg"
                  value={newTruck.currentLoad}
                  onChange={e => setNewTruck({ ...newTruck, currentLoad: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newTruck.status}
                  onChange={e => setNewTruck({ ...newTruck, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="on-route">On Route</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="full">Full</option>
                </select>
              </div>
            </div>
            <button onClick={handleCreate} className="submit-btn">
              Add Truck
            </button>
          </div>
        )}

        {/* Trucks Grid */}
        <div className="trucks-grid">
          {filteredTrucks.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-truck"></i>
              <h3>No trucks found</h3>
              <p>{filter !== "all" ? "Try changing your filters" : "Add your first truck to get started"}</p>
            </div>
          ) : (
            filteredTrucks.map(truck => (
              <div key={truck._id} className="truck-card">
                <div className="card-header">
                  <div className="truck-info">
                    <h4>{truck.name}</h4>
                    <span className="license-plate">{truck.licensePlate}</span>
                  </div>
                  <div className="truck-actions">
                    <button 
                      onClick={() => setEditingTruck(editingTruck?._id === truck._id ? null : truck)}
                      className="edit-btn"
                      title="Edit Truck"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(truck._id)}
                      className="delete-btn"
                      title="Delete Truck"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {editingTruck?._id === truck._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingTruck.name}
                      onChange={e => setEditingTruck({ ...editingTruck, name: e.target.value })}
                      placeholder="Truck name"
                    />
                    <input
                      type="text"
                      value={editingTruck.licensePlate}
                      onChange={e => setEditingTruck({ ...editingTruck, licensePlate: e.target.value })}
                      placeholder="License plate"
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleUpdate(editingTruck)} className="save-btn">
                        Save
                      </button>
                      <button onClick={() => setEditingTruck(null)} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="truck-details">
                      <div className="detail-item">
                        <i className="fas fa-weight"></i>
                        <span>Capacity: {truck.capacity} kg</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-box"></i>
                        <span>Current Load: {truck.currentLoad || 0} kg</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-percentage"></i>
                        <span>Load: {getLoadPercentage(truck).toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Load Progress Bar */}
                    <div className="load-indicator">
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill load-${getLoadLevel(getLoadPercentage(truck))}`}
                          style={{ width: `${Math.min(getLoadPercentage(truck), 100)}%` }}
                        ></div>
                      </div>
                      <span className="load-percentage">{getLoadPercentage(truck).toFixed(1)}%</span>
                    </div>

                    <div className="truck-status">
                      <div 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${getStatusColor(truck.status)}20`,
                          color: getStatusColor(truck.status)
                        }}
                      >
                        <i className={getStatusIcon(truck.status)}></i>
                        <span>{truck.status.replace('-', ' ').toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="utilization-stats">
                      <div className="utilization-item">
                        <span className="label">Capacity Used</span>
                        <span className="value">{getLoadPercentage(truck).toFixed(1)}%</span>
                      </div>
                      <div className="utilization-item">
                        <span className="label">Available</span>
                        <span className="value">{truck.capacity - (truck.currentLoad || 0)} kg</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Trucks;