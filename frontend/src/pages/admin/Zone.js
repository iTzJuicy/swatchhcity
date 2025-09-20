import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/common/admin/AdminLayout";
import { getZones, createZone, updateZone, deleteZone } from "../../services/api";

import "../../styles/pages/adminzones.css";

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newZone, setNewZone] = useState({ 
    name: "", 
    coordinates: [0, 0], 
    predictedWasteKg: 0, 
    complaints: 0 
  });
  const [editingZone, setEditingZone] = useState(null);
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
    fetchZones(); 
  }, []);

  const fetchZones = async () => {
  setLoading(true);
  try {
    const response = await getZones(); // Axios response
    setZones(response.data); // <-- Use response.data
  } catch (err) {
    console.error("Error fetching zones:", err);
    alert("Failed to fetch zones");
  }
  setLoading(false);
};


  const handleCreate = async () => {
    if (!newZone.name) return alert("Zone name is required");
    if (!newZone.coordinates[0] || !newZone.coordinates[1]) return alert("Valid coordinates are required");
    
    try {
      await createZone(newZone);
      setNewZone({ name: "", coordinates: [0, 0], predictedWasteKg: 0, complaints: 0 });
      setShowCreateForm(false);
      fetchZones();
      alert("Zone created successfully!");
    } catch (err) {
      console.error("Error creating zone:", err);
      alert("Failed to create zone");
    }
  };

  const handleUpdate = async (zone) => {
    try {
      await updateZone(zone._id, zone);
      setEditingZone(null);
      fetchZones();
      alert("Zone updated successfully!");
    } catch (err) {
      console.error("Error updating zone:", err);
      alert("Failed to update zone");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      try {
        await deleteZone(id);
        fetchZones();
        alert("Zone deleted successfully!");
      } catch (err) {
        console.error("Error deleting zone:", err);
        alert("Failed to delete zone");
      }
    }
  };

  const getWasteLevel = (wasteKg) => {
    if (wasteKg > 1000) return "high";
    if (wasteKg > 500) return "medium";
    return "low";
  };

  const getComplaintLevel = (complaints) => {
    if (complaints > 10) return "high";
    if (complaints > 5) return "medium";
    return "low";
  };

  const filteredZones = zones.filter(zone => {
    if (filter === "all") return true;
    if (filter === "high_waste") return zone.predictedWasteKg > 1000;
    if (filter === "high_complaints") return zone.complaints > 10;
    return true;
  });

  if (loading) return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-page-container">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading zones...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-page-container">
        <div className="admin-header">
          <div className="header-content">
            <h1>Zone Management</h1>
            <p>Manage waste collection zones and monitor their status</p>
          </div>
          <button onClick={fetchZones} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="zones-statistics">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{zones.length}</h3>
              <p>Total Zones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon high-waste">
              <i className="fas fa-trash"></i>
            </div>
            <div className="stat-content">
              <h3>{zones.filter(z => z.predictedWasteKg > 1000).length}</h3>
              <p>High Waste Zones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon high-complaints">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>{zones.filter(z => z.complaints > 10).length}</h3>
              <p>High Complaint Zones</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="zones-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Zones
            </button>
            <button 
              className={`filter-btn ${filter === "high_waste" ? "active" : ""}`}
              onClick={() => setFilter("high_waste")}
            >
              High Waste
            </button>
            <button 
              className={`filter-btn ${filter === "high_complaints" ? "active" : ""}`}
              onClick={() => setFilter("high_complaints")}
            >
              High Complaints
            </button>
          </div>
          
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-zone-btn"
          >
            <i className="fas fa-plus"></i>
            {showCreateForm ? "Cancel" : "Create New Zone"}
          </button>
        </div>

        {/* Create Zone Form */}
        {showCreateForm && (
          <div className="create-zone-form">
            <h3>Create New Zone</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Zone Name</label>
                <input
                  type="text"
                  placeholder="Enter zone name"
                  value={newZone.name}
                  onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                  value={newZone.coordinates[0]}
                  onChange={e => setNewZone({ ...newZone, coordinates: [parseFloat(e.target.value), newZone.coordinates[1]] })}
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  value={newZone.coordinates[1]}
                  onChange={e => setNewZone({ ...newZone, coordinates: [newZone.coordinates[0], parseFloat(e.target.value)] })}
                />
              </div>
              <div className="form-group">
                <label>Predicted Waste (kg)</label>
                <input
                  type="number"
                  placeholder="Waste in kg"
                  value={newZone.predictedWasteKg}
                  onChange={e => setNewZone({ ...newZone, predictedWasteKg: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Complaints</label>
                <input
                  type="number"
                  placeholder="Number of complaints"
                  value={newZone.complaints}
                  onChange={e => setNewZone({ ...newZone, complaints: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <button onClick={handleCreate} className="submit-btn">
              Create Zone
            </button>
          </div>
        )}

        {/* Zones Grid */}
        <div className="zones-grid">
          {filteredZones.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-map-marker-alt"></i>
              <h3>No zones found</h3>
              <p>{filter !== "all" ? "Try changing your filters" : "Create your first zone to get started"}</p>
            </div>
          ) : (
            filteredZones.map(zone => (
              <div key={zone._id} className="zone-card">
                <div className="card-header">
                  <h4>{zone.name}</h4>
                  <div className="zone-actions">
                    <button 
                      onClick={() => setEditingZone(editingZone?._id === zone._id ? null : zone)}
                      className="edit-btn"
                      title="Edit Zone"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(zone._id)}
                      className="delete-btn"
                      title="Delete Zone"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {editingZone?._id === zone._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingZone.name}
                      onChange={e => setEditingZone({ ...editingZone, name: e.target.value })}
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleUpdate(editingZone)} className="save-btn">
                        Save
                      </button>
                      <button onClick={() => setEditingZone(null)} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="zone-details">
                      <div className="detail-item">
                        <i className="fas fa-map-pin"></i>
                        <span>Coordinates: {zone.coordinates[0]?.toFixed(6)}, {zone.coordinates[1]?.toFixed(6)}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-trash"></i>
                        <span>
                          Waste: {zone.predictedWasteKg} kg
                          <span className={`waste-level ${getWasteLevel(zone.predictedWasteKg)}`}>
                            ({getWasteLevel(zone.predictedWasteKg)})
                          </span>
                        </span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>
                          Complaints: {zone.complaints}
                          <span className={`complaint-level ${getComplaintLevel(zone.complaints)}`}>
                            ({getComplaintLevel(zone.complaints)})
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="zone-status">
                      <div className="status-indicators">
                        <div className={`status-indicator waste-${getWasteLevel(zone.predictedWasteKg)}`}>
                          Waste Level
                        </div>
                        <div className={`status-indicator complaints-${getComplaintLevel(zone.complaints)}`}>
                          Complaint Level
                        </div>
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

export default Zones;