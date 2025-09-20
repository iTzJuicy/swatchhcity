import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/common/admin/AdminLayout";
import "../../styles/pages/adminreports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

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
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockReports = [
          { id: 1, title: "Monthly Waste Collection Report", type: "waste", period: "June 2024", generatedDate: "2024-06-30", fileSize: "2.5 MB", format: "PDF" },
          { id: 2, title: "User Activity Analysis", type: "analytics", period: "Q2 2024", generatedDate: "2024-06-28", fileSize: "1.8 MB", format: "PDF" },
          { id: 3, title: "Complaint Resolution Summary", type: "complaints", period: "June 2024", generatedDate: "2024-06-27", fileSize: "3.2 MB", format: "Excel" },
          { id: 4, title: "Recycling Performance Metrics", type: "recycling", period: "June 2024", generatedDate: "2024-06-25", fileSize: "4.1 MB", format: "PDF" },
          { id: 5, title: "Sustainability Impact Report", type: "sustainability", period: "Q2 2024", generatedDate: "2024-06-20", fileSize: "5.3 MB", format: "PDF" }
        ];
        setReports(mockReports);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLoading(false);
    }
  };

  const generateReport = (reportType) => {
    setGenerating(true);
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type: reportType,
        period: new Date().toLocaleDateString(),
        generatedDate: new Date().toISOString().split("T")[0],
        fileSize: "2.1 MB",
        format: "PDF",
      };
      setReports(prev => [newReport, ...prev]);
      setGenerating(false);
    }, 2000);
  };

  const getReportIcon = (type) => ({
    waste: "fas fa-trash-alt",
    analytics: "fas fa-chart-line",
    complaints: "fas fa-flag",
    recycling: "fas fa-recycle",
    sustainability: "fas fa-leaf"
  }[type] || "fas fa-file-alt");

  const getReportColor = (type) => ({
    waste: "#2E8B57",
    analytics: "#4682B4",
    complaints: "#FFD700",
    recycling: "#20C997",
    sustainability: "#6f42c1"
  }[type] || "#6c757d");

  if (loading) {
    return (
      <AdminLayout menuItems={menuItems}>
        <div className="admin-page-container">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="admin-page-container">
        {/* Header */}
        <div className="admin-header">
          <h1>Reports Management</h1>
          <p>Generate and manage detailed reports</p>
          <button onClick={fetchReports} className="refresh-btn">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon total"><i className="fas fa-file-alt"></i></div>
            <div className="stat-content"><h3>{reports.length}</h3><p>Total Reports</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pdf"><i className="fas fa-file-pdf"></i></div>
            <div className="stat-content"><h3>{reports.filter(r => r.format === "PDF").length}</h3><p>PDF Reports</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon excel"><i className="fas fa-file-excel"></i></div>
            <div className="stat-content"><h3>{reports.filter(r => r.format === "Excel").length}</h3><p>Excel Reports</p></div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="reports-grid">
          {reports.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <h3>No reports found</h3>
              <p>Generate a new report</p>
            </div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-icon" style={{ backgroundColor: `${getReportColor(report.type)}20` }}>
                    <i className={getReportIcon(report.type)} style={{ color: getReportColor(report.type) }}></i>
                  </div>
                  <div className="report-info">
                    <h4>{report.title}</h4>
                    <span className="report-period">{report.period}</span>
                  </div>
                </div>
                <div className="report-details">
                  <div className="detail-item"><span className="detail-label">Generated:</span> <span className="detail-value">{report.generatedDate}</span></div>
                  <div className="detail-item"><span className="detail-label">Format:</span> <span className="detail-value">{report.format}</span></div>
                  <div className="detail-item"><span className="detail-label">Size:</span> <span className="detail-value">{report.fileSize}</span></div>
                </div>
                <div className="report-actions">
                  <button className="download-btn"><i className="fas fa-download"></i> Download</button>
                  <button className="view-btn"><i className="fas fa-eye"></i> View</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;