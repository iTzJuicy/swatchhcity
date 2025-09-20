import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  getReportsByUser,
  deleteReport,
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createReport);
router.get("/all", getReports);
router.get("/user/:id", protect,getReportsByUser); // must be above /:id
router.get("/:id", getReportById);
router.patch("/:id/status", protect, updateReportStatus);
router.delete("/:id", protect, deleteReport);

export default router;
