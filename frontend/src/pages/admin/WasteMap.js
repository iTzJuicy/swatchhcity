import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/common/admin/AdminLayout";
import WasteMap from "../../components/common/admin/AdminWasteMap";
import { getZones, getOptimalRoutes } from "../../services/api";
import "../../styles/pages/adminwastemap.css";

export default function AdminWasteRoutes() {
  const [zones, setZones] = useState([]);
  const [truckRoutes, setTruckRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stats, setStats] = useState({
    totalZones: 0,
    highWasteZones: 0,
    totalWaste: 0,
    routesGenerated: 0,
  });

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

  // ------------------- Data Fetching -------------------
  const fetchZones = async () => {
    try {
      const res = await getZones();
      setZones(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch zones");
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await getOptimalRoutes();
      const routes = res.data?.routes || [];
      const processedRoutes = computeRouteTotals(routes);
      setTruckRoutes(processedRoutes);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch routes");
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchZones(), fetchRoutes()]);
    setLoading(false);
    toast.success("Data refreshed successfully");
  };

  // ------------------- Route Computation -------------------
  const computeRouteTotals = (routes) => {
    return routes.map(route => {
      const totalDistance = (route.routeZones || []).reduce(
        (sum, z) => sum + parseFloat(z.distance || 0), 0
      );
      const totalWaste = (route.routeZones || []).reduce(
        (sum, z) => sum + (z.predictedWasteKg || 0), 0
      );
      const estimatedTime = (route.routeZones || []).reduce(
        (sum, z) => sum + parseFloat(z.duration || 0), 0
      );

      return { ...route, totalDistance, totalWaste, estimatedTime };
    });
  };

  const generateNewRoutes = async () => {
    try {
      setLoading(true);
      const res = await getOptimalRoutes();
      const processedRoutes = computeRouteTotals(res.data?.routes || []);
      setTruckRoutes(processedRoutes);
      toast.success("New routes generated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate routes");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Stats -------------------
  const calculateStats = () => {
    const totalWaste = zones.reduce((sum, z) => sum + (z.predictedWasteKg || 0), 0);
    const highWasteZones = zones.filter(z => (z.predictedWasteKg || 0) > 1000).length;
    setStats({
      totalZones: zones.length,
      highWasteZones,
      totalWaste,
      routesGenerated: truckRoutes.length,
    });
  };

  useEffect(() => {
    calculateStats();
  }, [zones, truckRoutes]);

  useEffect(() => {
    refreshData();
  }, []);

  // ------------------- Waste Level -------------------
  const getWasteLevel = (wasteKg) => {
    if (wasteKg > 1000) return { level: "high", color: "#DC3545", icon: "fas fa-exclamation-triangle" };
    if (wasteKg > 500) return { level: "medium", color: "#FFD700", icon: "fas fa-exclamation-circle" };
    return { level: "low", color: "#2E8B57", icon: "fas fa-check-circle" };
  };

  if (loading) {
    return (
      <AdminLayout menuItems={menuItems}>
        <div className="admin-waste-container">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading waste data and routes...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ------------------- Render -------------------
  return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-waste-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <h1>Predictive Waste Management</h1>
            <p>Visualize waste zones and optimize collection routes</p>
          </div>
          <div className="header-buttons">
            <button onClick={refreshData} className="refresh-btn">
              <i className="fas fa-sync-alt"></i> Refresh Data
            </button>
            <button onClick={generateNewRoutes} className="generate-btn">
              <i className="fas fa-route"></i> Generate Routes
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="waste-statistics">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalZones}</h3>
              <p>Total Zones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon high-waste">
              <i className="fas fa-trash"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.highWasteZones}</h3>
              <p>High Waste Zones</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon waste">
              <i className="fas fa-weight-hanging"></i>
            </div>
            <div className="stat-content">
              <h3>{(stats.totalWaste / 1000).toFixed(1)}t</h3>
              <p>Total Waste</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon routes">
              <i className="fas fa-route"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.routesGenerated}</h3>
              <p>Active Routes</p>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Map Section */}
          <div className="map-section">
            <div className="section-header">
              <h2>Waste Collection Map</h2>
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color high-waste"></div>
                  <span>High Waste</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color medium-waste"></div>
                  <span>Medium Waste</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color low-waste"></div>
                  <span>Low Waste</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color route"></div>
                  <span>Truck Route</span>
                </div>
              </div>
            </div>
            <WasteMap zones={zones} trucks={truckRoutes} selectedRoute={selectedRoute} />
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Routes List */}
            <div className="routes-card">
              <div className="card-header">
                <h3>Truck Routes</h3>
                <span className="badge">{truckRoutes.length}</span>
              </div>
              <div className="routes-list">
                {truckRoutes.length === 0 ? (
                  <div className="empty-routes">
                    <i className="fas fa-route"></i>
                    <p>No routes generated</p>
                    <button onClick={generateNewRoutes} className="generate-btn-sm">
                      Generate Routes
                    </button>
                  </div>
                ) : (
                  truckRoutes.map((route, index) => (
                    <div
                      key={index}
                      className={`route-item ${selectedRoute === index ? "selected" : ""}`}
                      onClick={() => setSelectedRoute(selectedRoute === index ? null : index)}
                    >
                      <div className="route-header">
                        <div className="route-icon">
                          <i className="fas fa-truck"></i>
                        </div>
                        <div className="route-info">
                          <h4>Route {index + 1}</h4>
                          <span className="route-stats">
                            {(route.routeZones?.length || 0)} zones • {(route.totalDistance || 0).toFixed(1)} km
                          </span>
                        </div>
                      </div>
                      <div className="route-details">
                        <div className="detail-item">
                          <i className="fas fa-weight-hanging"></i>
                          <span>{(route.totalWaste || 0).toFixed(0)} kg</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-clock"></i>
                          <span>{(route.estimatedTime || 0).toFixed(0)} min</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* High Waste Zones */}
            <div className="zones-card">
              <div className="card-header">
                <h3>High Priority Zones</h3>
                <span className="badge">{stats.highWasteZones}</span>
              </div>
              <div className="zones-list">
                {zones.filter(z => (z.predictedWasteKg || 0) > 1000)
                  .slice(0, 5)
                  .map(zone => {
                    const wasteLevel = getWasteLevel(zone.predictedWasteKg);
                    return (
                      <div key={zone._id} className="zone-item">
                        <div className="zone-header">
                          <div
                            className="zone-status"
                            style={{ backgroundColor: `${wasteLevel.color}20`, color: wasteLevel.color }}
                          >
                            <i className={wasteLevel.icon}></i>
                          </div>
                          <div className="zone-info">
                            <h5>{zone.name}</h5>
                            <span className="zone-location">
                              {zone.coordinates?.[0]?.toFixed(4)}, {zone.coordinates?.[1]?.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <div className="zone-waste">
                          <span className="waste-amount">{zone.predictedWasteKg} kg</span>
                          <span className={`waste-level ${wasteLevel.level}`}>
                            {wasteLevel.level.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {stats.highWasteZones === 0 && (
                  <div className="empty-zones">
                    <i className="fas fa-check-circle"></i>
                    <p>No high waste zones</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <i className="fas fa-download"></i>
              <span>Export Data</span>
            </button>
            <button className="action-btn">
              <i className="fas fa-print"></i>
              <span>Print Routes</span>
            </button>
            <button className="action-btn">
              <i className="fas fa-envelope"></i>
              <span>Send to Drivers</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
