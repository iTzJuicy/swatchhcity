import React, { useEffect, useState } from "react";
import { getListings, acceptListing } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import AdminLayout from "../../components/common/admin/AdminLayout";
import "../../styles/pages/dealerlistings.css";

export default function DealerListings() {
  const { currentUser } = useAuth(); // dealer
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const menuItems = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: "fas fa-tachometer-alt" },
    { id: 2, title: "Complaints", path: "/admin/complaints", icon: "fas fa-flag" },
    { id: 3, title: "Recycling Opportunities", path: "/admin/dealer-listings", icon: "fas fa-store" },
    { id: 4, title: "Users", path: "/admin/users", icon: "fas fa-users" },
    { id: 5, title: "Rewards", path: "/admin/rewards", icon: "fas fa-gift" },
    { id: 6, title: "Reports", path: "/admin/reports", icon: "fas fa-file-alt" },
  ];

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await getListings();
      setListings(res.data);
    } catch (err) {
      toast.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      await acceptListing(id, currentUser.id);
      toast.success("Listing accepted successfully!");
      fetchListings(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept listing");
    } finally {
      setAcceptingId(null);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const getWasteTypeIcon = (type) => {
    const icons = {
      Plastic: "fas fa-water",
      Paper: "fas fa-file-alt",
      Glass: "fas fa-glass-martini-alt",
      Metal: "fas fa-wrench",
      "E-Waste": "fas fa-laptop",
      Organic: "fas fa-leaf",
      Textile: "fas fa-tshirt",
      Hazardous: "fas fa-flask",
      Other: "fas fa-trash-alt",
    };
    return icons[type] || "fas fa-trash-alt";
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      Plastic: "#007bff",
      Paper: "#28a745",
      Glass: "#17a2b8",
      Metal: "#6c757d",
      "E-Waste": "#fd7e14",
      Organic: "#20c997",
      Textile: "#e83e8c",
      Hazardous: "#dc3545",
      Other: "#6f42c1",
    };
    return colors[type] || "#6f42c1";
  };

  if (loading) {
    return (
      <AdminLayout menuItems={menuItems}>
        <div className="dealer-listings-container">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading available listings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="dealer-listings-container">
        {/* Header */}
        <div className="dealer-listings-header">
          <h2>Available Waste Listings</h2>
          <p>Browse and accept waste listings for recycling and processing</p>
          <button onClick={fetchListings} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh Listings
          </button>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>No listings available</h3>
            <p>There are currently no waste listings to display. Check back later!</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing._id} className="listing-card">
                <div className="listing-header">
                  <div
                    className="waste-type-badge"
                    style={{ backgroundColor: getWasteTypeColor(listing.wasteType) }}
                  >
                    <i className={getWasteTypeIcon(listing.wasteType)}></i>
                    <span>{listing.wasteType}</span>
                  </div>
                  <div className="quantity-badge">
                    <i className="fas fa-weight-hanging"></i>
                    {listing.quantity} kg
                  </div>
                </div>

                {listing.image && (
                  <div className="listing-image">
                    <img src={listing.image} alt={listing.wasteType} />
                  </div>
                )}

                <div className="listing-details">
                  <div className="detail-item">
                    <i className="fas fa-info-circle"></i>
                    <span>{listing.description || "No additional details"}</span>
                  </div>

                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <span>Listed by: {listing.userId?.name || "Unknown User"}</span>
                  </div>

                  <div className="detail-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Posted: {new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>

                  {listing.address && (
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{listing.address}</span>
                    </div>
                  )}
                </div>

                <div className="listing-actions">
                  <button
                    onClick={() => handleAccept(listing._id)}
                    disabled={acceptingId === listing._id}
                    className="accept-btn"
                  >
                    {acceptingId === listing._id ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle"></i>
                        Accept Listing
                      </>
                    )}
                  </button>

                  <button className="details-btn">
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}