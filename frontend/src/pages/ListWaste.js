import React, { useState } from "react";
import { submitListing } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/pages/listwaste.css";

export default function ListWaste() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    wasteType: "",
    quantity: "",
    description: "",
    image: null,
    location: { lat: null, lng: null },
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const wasteTypes = [
    "Plastic",
    "Paper",
    "Glass",
    "Metal",
    "E-Waste",
    "Organic",
    "Textile",
    "Hazardous",
    "Other"
  ];

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          location: { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude 
          }
        }));
        // In a real app, you would reverse geocode to get an address
        setFormData(prev => ({
          ...prev,
          address: `Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        }));
        setLocationLoading(false);
        toast.success("Location captured successfully!");
      },
      (err) => {
        toast.error("Unable to retrieve your location");
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wasteType || !formData.quantity || !formData.location.lat) {
      toast.error("Please select waste type, enter quantity, and provide location!");
      return;
    }

    setLoading(true);

    const listingData = new FormData();
    listingData.append("wasteType", formData.wasteType);
    listingData.append("quantity", formData.quantity);
    listingData.append("description", formData.description);
    listingData.append("image", formData.image);
    listingData.append("lat", formData.location.lat);
    listingData.append("lng", formData.location.lng);
    listingData.append("userId", currentUser.id);
    if (formData.address) {
      listingData.append("address", formData.address);
    }

    try {
      await submitListing(listingData);
      toast.success("Waste listed successfully! ♻️");
      setFormData({ 
        wasteType: "", 
        quantity: "", 
        description: "", 
        image: null, 
        location: { lat: null, lng: null },
        address: "" 
      });
      setImagePreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list waste");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  return (
    <div className="listwaste-container">
      <div className="listwaste-card">
        <div className="listwaste-header">
          <h2>List Recyclable Waste</h2>
          <p>Help others find and recycle waste materials by listing them here</p>
        </div>
        
        <form onSubmit={handleSubmit} className="listwaste-form">
          <div className="form-group ">
            <label htmlFor="wasteType">Waste Type *</label>
            <select
              id="wasteType"
              name="wasteType"
              value={formData.wasteType}
              onChange={handleChange}
              required
            >
              <option value="">Select waste type</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <i className="input-icon fas fa-trash-alt"></i>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity (kg) *</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="Enter quantity in kilograms"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
            />
            <i className="input-icon fas fa-weight-hanging"></i>
          </div>

          <div className="form-group">
            <label htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide additional details about the waste (condition, packaging, special instructions, etc.)"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Photo</label>
            <div className="image-upload-container">
              <label htmlFor="image" className="image-upload-label">
                <i className="fas fa-camera"></i>
                <span>{formData.image ? "Change Image" : " Choose an Image"}</span>
                <input 
                  type="file" 
                  id="image"
                  name="image" 
                  onChange={handleChange} 
                  accept="image/*" 
                  className="image-input"
                />
              </label>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Waste preview" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <div className="location-section">
              <button 
                type="button" 
                onClick={getLocation} 
                className="location-btn"
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <i className="fas fa-map-marker-alt"></i>
                    Use Current Location
                  </>
                )}
              </button>
              
              {formData.address && (
                <div className="location-display">
                  <i className="fas fa-check-circle"></i>
                  <span>{formData.address}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !formData.wasteType || !formData.quantity || !formData.location.lat}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Listing Waste...
              </>
            ) : (
              <>
                <i className="fas fa-recycle"></i>
                List Waste for Recycling
              </>
            )}
          </button>
        </form>

        <div className="listwaste-benefits">
          <h4>🌱 Benefits of Listing Waste</h4>
          <ul>
            <li>Help reduce landfill waste</li>
            <li>Contribute to circular economy</li>
            <li>Earn rewards and recognition</li>
            <li>Connect with recycling organizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}