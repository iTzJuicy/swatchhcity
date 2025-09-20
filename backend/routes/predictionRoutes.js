import express from "express";
import { predictWasteForAllZones } from "../controllers/predictionWasteController.js";

const router = express.Router();

// POST or GET, depending on your admin UI triggering it
router.post("/predict-all", predictWasteForAllZones);

export default router;
