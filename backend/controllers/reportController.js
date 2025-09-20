import reports from "../models/reports.js";
import { addRewardPoints } from "../utils/rewards.js";
// POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { description, lat, lng, category, address } = req.body; // Add category and address
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate category
    const validCategories = ["wet", "dry", "recyclable"];
    const normalizedCategory = category && validCategories.includes(category.toLowerCase())
      ? category.toLowerCase()
      : "dry"; // Default to 'dry' if invalid or missing

    // Validate location coordinates
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid or missing location coordinates" });
    }

    const report = new reports({
      user: req.user._id,
      description,
      category: normalizedCategory,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) }, // Ensure numbers
      imageUrl,
      address: address || "", // Include address, default to empty string if missing
    });

    await report.save();
    const points = await addRewardPoints(req.user._id, "report");

    res.status(201).json(report);
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ error: "Failed to create report", details: err.message });
  }
};

// GET /api/reports
export const getReports = async (req, res) => {
  try {
    const allReports = await reports.find()
      .populate("user", "-password -__v")
      .lean();

    // normalize structure
    const normalized = allReports.map(r => ({
      _id: r._id,
      description: r.description,
      imageUrl: r.imageUrl || null,   // <- use imageUrl
      image: r.imageUrl || null,      // <- optional: keep both for backward compatibility
      category: r.category,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      lat: r.location?.lat,
      lng: r.location?.lng,
      address: r.location?.address || null,
      userId: r.user ? { name: r.user.name, email: r.user.email, role: r.user.role } : null,
    }));

    res.json(normalized);

  } catch (err) {
    console.error("getReports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};


// GET /api/reports/:id
export const getReportById = async (req, res) => {
  try {
    const report = await reports.findById(req.params.id).populate("user", "name email");
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

// PATCH /api/reports/:id/status (admin only)
export const updateReportStatus = async (req, res) => {
  try {
    //if (req.user.role !== "admin") {
      //return res.status(403).json({ error: "Only admins can update status" });
    //}

    const { status } = req.body;
    const report = await reports.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// GET /api/reports/user/:id
export const getReportsByUser = async (req, res) => {
  try {
    const report = await reports.find({ user: req.params.id });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user reports" });
  }
};

// DELETE /api/reports/:id (owner only)
export const deleteReport = async (req, res) => {
  try {
    const report = await reports.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this report" });
    }

    await report.deleteOne();
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete report" });
  }
};
