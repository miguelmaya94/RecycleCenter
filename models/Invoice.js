import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Draft", "Sent", "Paid"], default: "Draft" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
