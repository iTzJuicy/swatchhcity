import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  currentLoad: { type: Number, default: 0 },
  assignedZone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone" }, // ✅ must match populate
  status: { 
    type: String, 
    enum: ["available", "on-route", "maintenance", "full", "idle", "assigned"], 
    default: "available" 
  }
}, { timestamps: true });

const Truck = mongoose.model("Truck", truckSchema);
export default Truck;
