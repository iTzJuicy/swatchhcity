import reports from "../models/reports.js";

// POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { description, lat, lng } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const report = new reports({
      user: req.user._id,
      description,
      location: { lat, lng },
      imageUrl,
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to create report", details: err.message });
  }
};

// GET /api/reports
export const getReports = async (req, res) => {
  try {
    const allreports = await reports.find().populate("user", "name email");
    res.json(allreports);
  } catch (err) {
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
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update status" });
    }

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
