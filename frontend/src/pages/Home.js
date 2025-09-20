// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/home.css";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Welcome to SwatchhCity</h1>
            <p className="hero-subtitle">
              AI-powered citizen waste management platform. Report, track, and recycle waste efficiently to keep your city clean and sustainable.
            </p>
            <div className="hero-buttons">
              <Link to="/report" className="btn btn-primary">
                <i className="fas fa-flag"></i>
                Report an Issue
              </Link>
              {currentUser ? (
                <Link to="/user-dashboard" className="btn btn-secondary">
                  <i className="fas fa-tachometer-alt"></i>
                  My Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="btn btn-secondary">
                  <i className="fas fa-user-plus"></i>
                  Get Started
                </Link>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card">
              <i className="fas fa-recycle"></i>
              <h4>Clean City Initiative</h4>
              <p>Join thousands of citizens making a difference</p>
            </div>
            <div className="floating-card">
              <i className="fas fa-star"></i>
              <h4>Earn Rewards</h4>
              <p>Get points for your contributions</p>
            </div>
            <div className="floating-card">
              <i className="fas fa-chart-line"></i>
              <h4>Track Impact</h4>
              <p>See your environmental impact grow</p>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <div className="stat-content">
                <h3>10,000+</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-clipboard-check"></i>
              <div className="stat-content">
                <h3>25,000+</h3>
                <p>Issues Resolved</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-recycle"></i>
              <div className="stat-content">
                <h3>50+ Tons</h3>
                <p>Waste Recycled</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-map-marker-alt"></i>
              <div className="stat-content">
                <h3>15+ Cities</h3>
                <p>Nationwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose SwatchhCity?</h2>
            <p>Empowering citizens and municipalities to create cleaner, sustainable cities together</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3>Instant Reporting</h3>
              <p>Report waste issues with just a few clicks. No paperwork needed with our streamlined digital process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>AI Classification</h3>
              <p>Advanced AI automatically categorizes and prioritizes waste reports for efficient processing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Real-time Tracking</h3>
              <p>Monitor your complaint status in real-time with live updates and progress notifications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3>Precise Geolocation</h3>
              <p>Pinpoint exact locations with GPS technology for faster, more accurate issue resolution.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>Reward System</h3>
              <p>Earn points and rewards for your environmental contributions and community participation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Transparent Process</h3>
              <p>Complete transparency in complaint handling with full visibility into municipal actions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How SwatchhCity Works</h2>
            <p>Four simple steps to make your city cleaner and greener</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-pen-alt"></i>
              </div>
              <h3>Report</h3>
              <p>Submit detailed complaints with photos, descriptions, and precise location data.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Process</h3>
              <p>Municipal authorities receive, verify, and prioritize issues using our smart system.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-check-double"></i>
              </div>
              <h3>Resolve</h3>
              <p>Track resolution progress in real-time and receive notifications when issues are fixed.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <h3>Reward</h3>
              <p>Earn points, badges, and rewards for your contributions to urban cleanliness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of citizens who are transforming their cities into cleaner, greener spaces</p>
            <div className="cta-buttons">
              {currentUser ? (
                <Link to="/report" className="btn btn-primary btn-large">
                  <i className="fas fa-plus"></i>
                  Report Your First Issue
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary btn-large">
                    <i className="fas fa-user-plus"></i>
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Hear from citizens who are making a difference in their communities</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"SwatchhCity made it so easy to report garbage issues in my area. The resolution was quick and I earned points too!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Rahul Sharma</h4>
                  <p>Mumbai Citizen</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The AI classification is amazing! It automatically categorized my waste report and helped authorities process it faster."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Priya Patel</h4>
                  <p>Delhi Resident</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a municipal worker, SwatchhCity has streamlined our complaint management process significantly. Great platform!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="author-info">
                  <h4>Arjun Kumar</h4>
                  <p>Municipal Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}