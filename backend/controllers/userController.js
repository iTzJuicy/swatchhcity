// controllers/userController.js
import reports from "../models/reports.js";

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id; // comes from protect middleware

    // Total reports
    const totalReports = await reports.countDocuments({ user: userId });

    // Status counts
    const statusCounts = await reports.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Category counts
    const categoryCounts = await reports.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      totalReports,
      statuses: statusCounts.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {}),
      categories: categoryCounts.reduce((acc, c) => {
        acc[c._id] = c.count;
        return acc;
      }, {}),
    });
  } catch (err) {
    console.error("getUserStats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};



// controllers/userController.js
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const recentReports = await reports.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("description category status createdAt location");

    res.json(recentReports);
  } catch (err) {
    console.error("getRecentActivity error:", err);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};
