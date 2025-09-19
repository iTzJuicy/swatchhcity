import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/pages/auth.css";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
  toast.error("Name is required ❌");
  return;
}
    if (!formData.email) {
  toast.error("Email is required ❌");
  return;
}

if (!/\S+@\S+\.\S+/.test(formData.email)) {
  toast.error("Enter a valid email ❌");
  return;
}


    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match ❌");
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="fas fa-recycle"></i>
            <span>SwatchhCity</span>
          </div>
          <h2>Create Your Account</h2>
          <p>Join us in making cities cleaner and greener</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
             
            />
            <i className="input-icon fas fa-user"></i>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              
            />
            <i className="input-icon fas fa-envelope"></i>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
             
            />
            <i className="input-icon fas fa-lock"></i>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
             
            />
            <i className="input-icon fas fa-lock"></i>
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Sign Up
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
        
        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>
        
        <div className="social-auth">
          <button className="social-button google-btn">
            <i className="fab fa-google"></i>
            Google
          </button>
          <button className="social-button facebook-btn">
            <i className="fab fa-facebook-f"></i>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;