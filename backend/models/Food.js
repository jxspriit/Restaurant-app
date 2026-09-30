import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Food name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Pizza", "Burgers", "Pasta", "Indian", "Chinese", "Desserts", "Drinks"],
    },
    image: { type: String, default: "" },
    isVeg: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    orderCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

foodSchema.index({ name: "text", description: "text" });

export default mongoose.model("Food", foodSchema);
