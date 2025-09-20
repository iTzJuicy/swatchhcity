import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recycleRoutes from "./routes/recycleRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";

import truckRoutes from "./routes/truckRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SwatchhCity Backend Running ");
});


// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRouter);
app.use("/api/recycle", recycleRoutes);
app.use("/api/rewards", rewardRoutes);

app.use("/api/trucks", truckRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/routes", routeRoutes);

export default app;

