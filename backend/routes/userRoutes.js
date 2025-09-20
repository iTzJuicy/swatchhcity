import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserStats, getRecentActivity } from "../controllers/userController.js";

const router = express.Router();

// User-specific stats
router.get("/stats", protect, getUserStats);

// Recent activity (last 5 reports)
router.get("/activity", protect, getRecentActivity);

export default router;