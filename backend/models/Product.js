import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ["Dresses", "Outerwear", "Suits", "Footwear", "Bags", "Accessories", "Jewelry"],
    },
    occasion: [{ type: String }], // e.g. ["Formal Evening", "Wedding", "Casual", "Business"]
    color: [{ type: String }], // e.g. ["Black", "Ivory", "Gold"]
    sizes: [{ type: String }], // e.g. ["XS","S","M","L","XL"]
    material: { type: String },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true },
    brand: { type: String, default: "Valerion" },
    tags: [{ type: String }], // free-form keywords used by the AI assistant
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  tags: "text",
  color: "text",
  occasion: "text",
});

export default mongoose.model("Product", productSchema);
