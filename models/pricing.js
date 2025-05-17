import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consultationFee: { type: Number, required: true },
  },
  { timestamps: true }
);

const Pricing = mongoose.model("Pricing", pricingSchema);
export default Pricing;
