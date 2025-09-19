// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/components/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-recycle"></i>
              <span>SwatchhCity</span>
            </div>
            <p className="footer-description">AI-powered waste management platform for cleaner cities and sustainable communities.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/report">Report Issue</Link></li>
              <li><Link to="/complaints">My Complaints</Link></li>
              <li><Link to="/rewards">Rewards</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Waste Management Guide</a></li>
              <li><a href="#">Recycling Tips</a></li>
              <li><a href="#">Community Initiatives</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              <li><i className="fas fa-envelope"></i> support@swatchhcity.com</li>
              <li><i className="fas fa-phone"></i> +91 1800-123-456</li>
              <li><i className="fas fa-map-marker-alt"></i> Mangaluru, India</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 SwatchhCity. All rights reserved.</p>
            <div className="footer-legals">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;