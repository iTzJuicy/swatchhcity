import Zone from "../models/Zone.js";

// Get all zones
export const getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch zones" });
  }
};

// Get a single zone by ID
export const getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) return res.status(404).json({ message: "Zone not found" });
    res.status(200).json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch zone" });
  }
};

// Create a new zone
export const createZone = async (req, res) => {
  try {
    const { name, coordinates, predictedWasteKg, complaints } = req.body;

    const zone = new Zone({
      name,
      coordinates,
      predictedWasteKg: Number(predictedWasteKg) || 0,
      complaints: Number(complaints) || 0
    });

    await zone.save();
    res.status(201).json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create zone" });
  }
};


// Update a zone's waste level
export const updateZone = async (req, res) => {
  try {
    const { name, coordinates, predictedWasteKg, complaints } = req.body;

    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      {
        name,
        coordinates,
        predictedWasteKg: Number(predictedWasteKg) || 0,
        complaints: Number(complaints) || 0,
        lastUpdated: Date.now()
      },
      { new: true }
    );

    if (!zone) return res.status(404).json({ message: "Zone not found" });

    res.status(200).json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update zone" });
  }
};
// Delete a zone by ID
export const deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);

    if (!zone) return res.status(404).json({ message: "Zone not found" });

    res.status(200).json({ message: "Zone deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete zone" });
  }
};

