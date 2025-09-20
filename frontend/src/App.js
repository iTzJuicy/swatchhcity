// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/admin/Dashboard';
import Reports from './pages/admin/reports';
import Users from './pages/admin/users';


import ReportComplaint from './pages/ReportComplaint';
import Complaints from './pages/admin/Complaints';
import Zone from './pages/admin/Zone';
import Truck from './pages/admin/Truck';
import WasteMap from './pages/admin/WasteMap';
import WastePrediction from './pages/admin/WastePrediction';




import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import ListWaste from './pages/ListWaste';
import DealerListings from './pages/admin/DealerListings';
import MyComplaints from './pages/MyComplaints';
import UserDashboard from './pages/UserDashboard';
import Categorise from './pages/Categorise';

import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

// Main App Content
function AppContent() {
  const location = useLocation();

  return (
    <div className="App">
      {/* Render Header/Footer only for non-admin routes */}
      {!location.pathname.startsWith('/admin') && <Header />}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/complaints" element={<Complaints />} />
          <Route path="/admin/dealer-listings" element={<DealerListings />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/zones" element={<Zone />} />
          <Route path="/admin/trucks" element={<Truck />} />
          <Route path="/admin/wastemap" element={<WasteMap />} />
          <Route path="/admin/wasteprediction" element={<WastePrediction />} />







          {/* User Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportComplaint /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/recycle-waste" element={<ProtectedRoute><ListWaste /></ProtectedRoute>} />
          <Route path="/my-complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
           <Route 
            path="/categorise" 
            element={
              <ProtectedRoute>
                <Categorise />
              </ProtectedRoute>
            } 
          /> 
          <Route 
            path="/complaints" 
            element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>
            } 
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!location.pathname.startsWith('/admin') && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
// App Wrapper with AuthProvider and Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
