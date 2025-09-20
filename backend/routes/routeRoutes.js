// routes/routeRoutes.js
import express from "express";
import { getOptimalRoutes } from "../controllers/routeController.js";

const router = express.Router();
router.get("/optimal", getOptimalRoutes);




export default router;
