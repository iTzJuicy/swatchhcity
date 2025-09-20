import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import truckRoutes from "./routes/truckRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";


dotenv.config();
const app = express();

// ===================== CORS =====================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4000",
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
// Preflight handler for all OPTIONS requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", frontendUrl);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

console.log("CORS origin set to:", process.env.FRONTEND_URL);


// ===================== Middleware =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================== Routes =====================
app.get("/", (req, res) => res.send("SwatchhCity Backend Running"));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/predictions", predictionRoutes);



app.use("/api/routes", routeRoutes);



export default app;
