import express from "express";
import * as truckController from "../controllers/truckController.js";

const router = express.Router();

// Assign truck to zone must come first
router.put("/assign", truckController.assignTruckToZone);

// Then other CRUD routes
router.post("/", truckController.createTruck);
router.get("/", truckController.getAllTrucks);
router.get("/:id", truckController.getTruckById);
router.put("/:id", truckController.updateTruck);
router.delete("/:id", truckController.deleteTruck);


export default router;
