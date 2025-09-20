import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRewards } from "../services/api";
import "../styles/pages/userrewards.css";

const Rewards = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUserRewards = async () => {
      try {
        const res = await getUserRewards(currentUser._id);
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRewards();
  }, [currentUser]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Use user.points instead of user.credits
  const progress = (user.points / 200) * 100;

  return (
    <div className="rewards-container">
      <h1 className="title">CREDIT POINTS</h1>
      <p className="subtitle">Track your green journey & see your eco impact.</p>

      <div className="card">
        <div className="icon">
          <span>★</span>
        </div>
        <h2 className="card-title">Your Green Credits</h2>
        <p className="credits">{user.points}</p> {/* Changed from user.credits */}
        <p className="badge">Eco Warrior 🌍</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">{user.points}/200 Credits to next level</p> {/* Changed from user.credits */}
      </div>

      <div className="button-group">
        <button className="btn btn-blue">REPORT ISSUE</button>
        <button className="btn btn-green">SEGREGATE WASTE</button>
        <button className="btn btn-yellow">JOIN CLEANUP</button>
      </div>
    </div>
  );
};

export default Rewards;