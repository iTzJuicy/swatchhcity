import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submitComplaint, classifyWaste } from "../services/api";
import { toast } from "react-toastify";
import "../styles/pages/report.css";

export default function ReportComplaint() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    image: null,
    location: { lat: null, lng: null },
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Get user location
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
    if (!formData.description || !formData.image || !formData.location.lat) {
      toast.error("Please provide description, image, and location!");
      return;
    }

    setLoading(true);

    try {
      // Optional AI classification
      const aiForm = new FormData();
      aiForm.append("image", formData.image);
      const aiRes = await classifyWaste(aiForm);
      const category = aiRes.data.category ;

      // Submit complaint
      const complaintForm = new FormData();
      complaintForm.append("description", formData.description);
      complaintForm.append("category", category);
      complaintForm.append("image", formData.image);
      complaintForm.append("lat", formData.location.lat);
      complaintForm.append("lng", formData.location.lng);
      complaintForm.append("userId", currentUser._id);
      if (formData.address) {
        complaintForm.append("address", formData.address);
      }

      await submitComplaint(complaintForm);
      toast.success("Complaint submitted successfully! ");
      
      // Reset form
      setFormData({ 
        description: "", 
        category: "", 
        image: null, 
        location: { lat: null, lng: null },
        address: "" 
      });
      setImagePreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed ");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <div className="report-header">
          <h2>Report Garbage Issue</h2>
          <p>Help us keep your city clean by reporting waste management issues</p>
        </div>
        
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="description">Issue Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the issue in detail (type of waste, quantity, specific location details, etc.)"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Photo Evidence</label>
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
                  required 
                  className="image-input"
                />
              </label>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
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
            disabled={loading || !formData.image || !formData.location.lat}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Submitting Report...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Submit Report
              </>
            )}
          </button>
        </form>

        <div className="report-tips">
          <h4> Reporting Tips</h4>
          <ul>
            <li>Take clear photos showing the waste issue</li>
            <li>Include landmarks for easier identification</li>
            <li>Describe the type and approximate quantity of waste</li>
            <li>Ensure location services are enabled for accurate reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}