import Truck from "../models/Truck.js";
import Zone from "../models/Zone.js";

// Get all trucks
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate({ path: "assignedZone", strictPopulate: false });
    res.status(200).json(trucks);
  } catch (err) {
    console.error("Error fetching trucks:", err);
    res.status(500).json({ message: "Failed to fetch trucks", error: err.message });
  }
};

// Get truck by ID
export const getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate({ path: "assignedZone", strictPopulate: false });
    if (!truck) return res.status(404).json({ message: "Truck not found" });
    res.status(200).json(truck);
  } catch (err) {
    console.error("Error fetching truck:", err);
    res.status(500).json({ message: "Failed to fetch truck", error: err.message });
  }
};

// Create a truck
export const createTruck = async (req, res) => {
  try {
    const { name, capacity, licensePlate, status, currentLoad } = req.body;

    if (!name || !capacity || !licensePlate) {
      return res.status(400).json({ message: "Name, capacity, and licensePlate are required" });
    }

    const truck = new Truck({ 
      name, 
      capacity, 
      licensePlate, 
      status: status || "available",
      currentLoad: currentLoad || 0
    });

    await truck.save();
    res.status(201).json(truck);
  } catch (err) {
    console.error("Error creating truck:", err);
    res.status(500).json({ message: "Failed to create truck", error: err.message });
  }
};

// Update truck
export const updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!truck) return res.status(404).json({ message: "Truck not found" });
    res.status(200).json(truck);
  } catch (err) {
    console.error("Error updating truck:", err);
    res.status(500).json({ message: "Failed to update truck", error: err.message });
  }
};

// Delete truck
export const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) return res.status(404).json({ message: "Truck not found" });
    res.status(200).json({ message: "Truck deleted successfully" });
  } catch (err) {
    console.error("Error deleting truck:", err);
    res.status(500).json({ message: "Failed to delete truck", error: err.message });
  }
};

// Assign truck to zone
export const assignTruckToZone = async (req, res) => {
  try {
    const { truckId, zoneId } = req.body;

    const truck = await Truck.findById(truckId);
    if (!truck) return res.status(404).json({ message: "Truck not found" });

    const zone = await Zone.findById(zoneId);
    if (!zone) return res.status(404).json({ message: "Zone not found" });

    truck.assignedZone = zone._id;
    truck.status = "assigned"; // Make sure "assigned" is in your Truck schema enum
    await truck.save();

    const populatedTruck = await Truck.findById(truck._id).populate({ path: "assignedZone", strictPopulate: false });

    res.status(200).json(populatedTruck);
  } catch (err) {
    console.error("Error assigning truck to zone:", err);
    res.status(500).json({ message: "Failed to assign truck to zone", error: err.message });
  }
};
