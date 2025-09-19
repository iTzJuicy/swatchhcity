import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/categorise.css";

const Categorise = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/ai/waste-category", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token for protected route
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${response.status} - ${text}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return "category-default";
    const lower = category.toLowerCase();
    if (lower.includes("wet")) return "category-wet";
    if (lower.includes("dry")) return "category-dry";
    if (lower.includes("recyclable")) return "category-recyclable";
    return "category-default";
  };

  return (
    <div className="categorise-container">
      <div className="categorise-card">
        <h2>Waste Categorization</h2>
        <p>Upload an image of waste to see how it should be categorized and handled.</p>

        <form onSubmit={handleSubmit}>
          <label className="dropzone" htmlFor="dropzone-file">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="dropzone-text">
                <svg
                  className="dropzone-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-4-4v-4a4 4 0 014-4h10a4 4 0 014 4v4a4 4 0 01-4 4H7z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12h-6m3-3v6"
                  ></path>
                </svg>
                <p><strong>Click to upload</strong> or drag and drop</p>
                <p>SVG, PNG, JPG (MAX. 800x400px)</p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg, image/png"
            />
          </label>

          <button
            type="submit"
            disabled={!file || loading}
            className={`submit-btn ${loading ? "disabled" : ""}`}
          >
            {loading ? "Analyzing..." : "Analyze Waste"}
          </button>
        </form>

        {loading && <p className="status-text">Analyzing image...</p>}
        {error && <p className="error-text">{error}</p>}

        {result && (
          <div className="result-card">
            <h3>Categorization Result</h3>
            <p>
              <strong>Category:</strong>{" "}
              <span className={getCategoryColor(result.category)}>
                {result.category || "N/A"}
              </span>
            </p>
            <p>
              <strong>Composting Advice:</strong> {result.compost_advice || "No specific advice."}
            </p>
            <p>
              <strong>Recycling Advice:</strong> {result.recyclable_advice || "No specific advice."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categorise;
