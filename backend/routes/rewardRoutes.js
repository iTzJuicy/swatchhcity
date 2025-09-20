import express from "express";
import { getUserRewards, getAllRewards } from "../controllers/rewardsController.js";

const router = express.Router();

// Get specific user rewards
router.get("/user/:id", getUserRewards);

// Get all users' rewards
router.get("/all", getAllRewards);

export default router;
