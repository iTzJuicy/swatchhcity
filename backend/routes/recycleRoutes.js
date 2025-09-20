import express from "express";
import multer from "multer";
import Listing from "../models/Listing.js";
import { protect } from "../middleware/authMiddleware.js";
import path from "path";
import { addRewardPoints } from "../utils/rewards.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// POST /api/listings - create new listing
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { wasteType, quantity, description, lat, lng, address } = req.body;

    if (!wasteType || !quantity || !lat || !lng) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newListing = new Listing({
      userId: req.user._id,
      wasteType,
      quantity,
      description,
      location: {
        lat,
        lng,
        address,
      },
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newListing.save();
    const points = await addRewardPoints(req.user._id, "report");
    res.status(201).json(newListing);
    
  } catch (err) {
    console.error("Listing creation error:", err);
    res.status(500).json({ message: "Failed to create listing" });
  }
});

// GET /api/listings - get all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("userId", "name email role") // optional, like your reports
      .lean();

    // normalize data for frontend
    const normalized = listings.map((l) => ({
      _id: l._id,
      wasteType: l.wasteType,
      quantity: l.quantity,
      description: l.description,
      image: l.imageUrl,
      lat: l.location.lat,
      lng: l.location.lng,
      address: l.location.address || null,
      user: l.userId ? { name: l.userId.name, email: l.userId.email } : null,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Get listings error:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

export default router;
