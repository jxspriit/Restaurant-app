import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zip: String,
      phone: { type: String, required: true },
    },
    customerName: { type: String, required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 40 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
