import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);