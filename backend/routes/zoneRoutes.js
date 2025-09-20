import express from "express";
import * as zoneController from "../controllers/zoneController.js";

const router = express.Router();

router.post("/", zoneController.createZone);
router.get("/", zoneController.getAllZones);
router.get("/:id", zoneController.getZoneById);
router.put("/:id", zoneController.updateZone); 
router.delete("/:id",zoneController.deleteZone);
export default router;
