import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/common/admin/AdminLayout";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../../styles/pages/wasteprediction.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function WastePredictionMap() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalZones: 0,
    highWaste: 0,
    totalWaste: 0,
    peakHours: {}
  });

  const menuItems = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: "fas fa-tachometer-alt" },
    { id: 2, title: "Complaints", path: "/admin/complaints", icon: "fas fa-flag" },
    { id: 3, title: "Recycling Opportunities", path: "/admin/dealer-listings", icon: "fas fa-store" },
    { id: 4, title: "Users", path: "/admin/users", icon: "fas fa-users" },
    { id: 5, title: "Zones", path: "/admin/zones", icon: "fas fa-map-marker-alt" },
    { id: 6, title: "Trucks", path: "/admin/trucks", icon: "fas fa-truck" },
    { id: 7, title: "Rewards", path: "/admin/rewards", icon: "fas fa-gift" },
    { id: 8, title: "Reports", path: "/admin/reports", icon: "fas fa-file-alt" },
  ];

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [zones]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/predictions/predict-all");
      setZones(res.data.zones || []);
      toast.success("Predictions loaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch predicted zones");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const highWaste = zones.filter(zone => zone.predictedWasteKg > 15).length;
    const totalWaste = zones.reduce((sum, zone) => sum + (zone.predictedWasteKg || 0), 0);
    
    const peakHours = {};
    zones.forEach(zone => {
      if (zone.peakGarbageHour !== null) {
        const hour = zone.peakGarbageHour;
        peakHours[hour] = (peakHours[hour] || 0) + 1;
      }
    });

    setStats({
      totalZones: zones.length,
      highWaste,
      totalWaste,
      peakHours
    });
  };

  const getZoneColor = (kg) => {
    if (kg <= 5) return "#2E8B57"; // Green
    if (kg <= 15) return "#FFD700"; // Yellow/Orange
    return "#DC3545"; // Red
  };

  const getZoneRadius = (kg) => {
    return 8 + (kg / 5); // Scale radius based on waste amount
  };

  const getZoneIcon = (kg) => {
    if (kg <= 5) return "fas fa-check-circle";
    if (kg <= 15) return "fas fa-exclamation-circle";
    return "fas fa-exclamation-triangle";
  };

  const filteredZones = zones.filter(zone => {
    if (filter === "all") return true;
    if (filter === "high") return zone.predictedWasteKg > 15;
    if (filter === "medium") return zone.predictedWasteKg > 5 && zone.predictedWasteKg <= 15;
    if (filter === "low") return zone.predictedWasteKg <= 5;
    return true;
  });

  const getPeakHourDistribution = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => ({
      hour,
      count: stats.peakHours[hour] || 0,
      formatted: `${hour}:00`
    }));
  };

  if (loading) {
    return (
      <AdminLayout menuItems={menuItems}>
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading waste predictions...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="waste-prediction-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <h1>Waste Prediction Analytics</h1>
            <p>AI-powered waste generation predictions across city zones</p>
          </div>
          <button onClick={fetchPredictions} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh Predictions
          </button>
        </div>

        {/* Statistics */}
        <div className="prediction-statistics">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalZones}</h3>
              <p>Monitored Zones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon high-waste">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.highWaste}</h3>
              <p>High Waste Zones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon waste">
              <i className="fas fa-weight-hanging"></i>
            </div>
            <div className="stat-content">
              <h3>{(stats.totalWaste / 1000).toFixed(1)}t</h3>
              <p>Total Predicted Waste</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon peak">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <h3>{Object.keys(stats.peakHours).length}</h3>
              <p>Peak Hours Detected</p>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Main Map Section */}
          <div className="map-section">
            <div className="section-header">
              <h2>Waste Prediction Map</h2>
              <div className="map-controls">
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                  >
                    All Zones
                  </button>
                  <button 
                    className={`filter-btn ${filter === "high" ? "active" : ""}`}
                    onClick={() => setFilter("high")}
                  >
                    High Waste
                  </button>
                  <button 
                    className={`filter-btn ${filter === "medium" ? "active" : ""}`}
                    onClick={() => setFilter("medium")}
                  >
                    Medium Waste
                  </button>
                  <button 
                    className={`filter-btn ${filter === "low" ? "active" : ""}`}
                    onClick={() => setFilter("low")}
                  >
                    Low Waste
                  </button>
                </div>
                <div className="map-legend">
                  <div className="legend-item">
                    <div className="legend-color high"></div>
                    <span>High Waste (&gt;15kg)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color medium"></div>
                    <span>Medium Waste (5-15kg)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color low"></div>
                    <span>Low Waste (&lt;5kg)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="map-container">
              <MapContainer
                center={[12.9716, 77.5946]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <ZoomControl position="topright" />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {filteredZones.map((zone) => (
                  <CircleMarker
                    key={zone._id}
                    center={[zone.coordinates[0], zone.coordinates[1]]}
                    radius={getZoneRadius(zone.predictedWasteKg)}
                    color={getZoneColor(zone.predictedWasteKg)}
                    fillColor={getZoneColor(zone.predictedWasteKg)}
                    fillOpacity={0.6}
                    weight={2}
                    eventHandlers={{
                      click: () => setSelectedZone(zone),
                    }}
                  >
                    <Popup>
                      <div className="zone-popup">
                        <div className="popup-header">
                          <h4>{zone.name}</h4>
                          <div 
                            className="waste-level-badge"
                            style={{ 
                              backgroundColor: `${getZoneColor(zone.predictedWasteKg)}20`,
                              color: getZoneColor(zone.predictedWasteKg)
                            }}
                          >
                            <i className={getZoneIcon(zone.predictedWasteKg)}></i>
                            {zone.predictedWasteKg <= 5 ? "Low" : zone.predictedWasteKg <= 15 ? "Medium" : "High"}
                          </div>
                        </div>
                        <div className="popup-details">
                          <div className="detail-item">
                            <i className="fas fa-trash"></i>
                            <span><strong>{zone.predictedWasteKg} kg</strong> predicted waste</span>
                          </div>
                          {zone.peakGarbageHour !== null && (
                            <div className="detail-item">
                              <i className="fas fa-clock"></i>
                              <span>Peak hour: <strong>{zone.peakGarbageHour}:00</strong></span>
                            </div>
                          )}
                          <div className="detail-item">
                            <i className="fas fa-map-pin"></i>
                            <span>{zone.coordinates[0].toFixed(4)}, {zone.coordinates[1].toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Selected Zone Details */}
            {selectedZone && (
              <div className="selected-zone-card">
                <div className="card-header">
                  <h3>Selected Zone</h3>
                  <button 
                    onClick={() => setSelectedZone(null)}
                    className="close-btn"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="zone-details">
                  <h4>{selectedZone.name}</h4>
                  <div className="waste-level">
                    <div 
                      className="level-indicator"
                      style={{ backgroundColor: getZoneColor(selectedZone.predictedWasteKg) }}
                    ></div>
                    <span className="level-text">
                      {selectedZone.predictedWasteKg <= 5 ? "Low" : 
                       selectedZone.predictedWasteKg <= 15 ? "Medium" : "High"} Waste Level
                    </span>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-card">
                      <i className="fas fa-weight-hanging"></i>
                      <div className="detail-content">
                        <span className="value">{selectedZone.predictedWasteKg} kg</span>
                        <span className="label">Predicted Waste</span>
                      </div>
                    </div>
                    {selectedZone.peakGarbageHour !== null && (
                      <div className="detail-card">
                        <i className="fas fa-clock"></i>
                        <div className="detail-content">
                          <span className="value">{selectedZone.peakGarbageHour}:00</span>
                          <span className="label">Peak Hour</span>
                        </div>
                      </div>
                    )}
                    <div className="detail-card">
                      <i className="fas fa-map-marker-alt"></i>
                      <div className="detail-content">
                        <span className="value">
                          {selectedZone.coordinates[0].toFixed(4)}, {selectedZone.coordinates[1].toFixed(4)}
                        </span>
                        <span className="label">Coordinates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Peak Hours Distribution */}
            <div className="peak-hours-card">
              <div className="card-header">
                <h3>Peak Hours Distribution</h3>
              </div>
              <div className="peak-hours-list">
                {getPeakHourDistribution()
                  .filter(item => item.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.hour} className="peak-hour-item">
                      <span className="hour">{item.formatted}</span>
                      <div className="count-bar">
                        <div 
                          className="bar-fill"
                          style={{ width: `${(item.count / Math.max(...getPeakHourDistribution().map(i => i.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="count">{item.count} zones</span>
                    </div>
                  ))
                }
                {getPeakHourDistribution().filter(item => item.count > 0).length === 0 && (
                  <div className="empty-peak-hours">
                    <i className="fas fa-chart-line"></i>
                    <p>No peak hour data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-card">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <i className="fas fa-download"></i>
                  Export Data
                </button>
                <button className="action-btn">
                  <i className="fas fa-chart-bar"></i>
                  Generate Report
                </button>
                <button className="action-btn">
                  <i className="fas fa-bell"></i>
                  Set Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}