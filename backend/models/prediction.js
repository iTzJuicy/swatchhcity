import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
  predictedWaste: { type: Number, required: true }, // in kg
  date: { type: Date, required: true },
  optimalTruck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
}, { timestamps: true });

const Prediction = mongoose.model("Prediction", predictionSchema);
export default Prediction;
