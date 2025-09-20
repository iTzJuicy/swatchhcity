import User from "../models/user.js";

// Get a specific user's rewards
export const getUserRewards = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("points");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users' rewards
export const getAllRewards = async (req, res) => {
  try {
    const users = await User.find().select("points");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
