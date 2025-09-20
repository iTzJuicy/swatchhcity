import express from "express";
import { categorizeWaste } from "../controllers/aiController.js";
import { upload } from "../utils/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// AI-based waste categorization
router.post("/waste-category", protect, upload.single("image"), categorizeWaste);

export default router;