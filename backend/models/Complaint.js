import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
