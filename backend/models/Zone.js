import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: { type: [Number], required: true }, // [lat, lng]
  complaints: { type: Number, default: 0 },
  predictedWasteKg: { type: Number, default: 0 },
  assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" } // single truck per zone
}, { timestamps: true });

const Zone = mongoose.model("Zone", zoneSchema);
export default Zone;
