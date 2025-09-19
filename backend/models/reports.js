import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  description: { type: String, required: true },
  imageUrl: { type: String }, // store file URL or Cloudinary link
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  category: { type: String, enum: ["wet", "dry", "recyclable", "uncategorized"], default: "uncategorized" },
  status: { type: String, enum: ["pending", "in_progress", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
