// src/pages/Complaints.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "react-toastify";
import "../styles/pages/complaints.css";

const Complaints = () => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        // Assuming backend has GET /reports?userId=<id>
        const res = await API.get(`/reports/user/${currentUser._id}`);
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-pending">Pending</span>;
      case "in-progress":
        return <span className="badge badge-in-progress">In Progress</span>;
      case "resolved":
        return <span className="badge badge-resolved">Resolved</span>;
      case "rejected":
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge badge-default">{status}</span>;
    }
  };

  return (
    <div className="complaints-container">
      <h2>My Complaints</h2>

      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints found. Submit one from the report page.</p>
      ) : (
        <div className="complaints-list">
          {complaints.map((c) => (
            <div key={c._id} className="complaint-card">
              <div className="complaint-header">
                <h3>{c.description}</h3>
                {getStatusBadge(c.status)}
              </div>
              <div className="complaint-body">
                {c.imageUrl && (
                  <img
                    src={`http://localhost:5000${c.imageUrl}`}
                    alt="Complaint"
                    className="complaint-image"
                  />
                )}
                <p>
                  <strong>Category:</strong> {c.category || "N/A"}
                </p>
                {c.location && (
                  <p>
                    <strong>Location:</strong>{" "}
                    {c.location.lat}, {c.location.lng}
                  </p>
                )}
                {c.address && (
                  <p>
                    <strong>Address:</strong> {c.address}
                  </p>
                )}
                <p>
                  <strong>Submitted At:</strong>{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints;
