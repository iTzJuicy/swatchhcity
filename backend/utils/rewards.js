import User from "../models/user.js";

// Reward points mapping
const rewardPoints = {
  report: 10,
  recycle: 20,
  cleanup: 30,
  // add more actions if needed
};

// Add points to a user
export const addRewardPoints = async (userId, action) => {
  if (!rewardPoints[action]) {
    throw new Error("Invalid reward action");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.points += rewardPoints[action];
  await user.save();

  return user.points;
};
