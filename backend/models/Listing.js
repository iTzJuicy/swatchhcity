import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wasteType: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
