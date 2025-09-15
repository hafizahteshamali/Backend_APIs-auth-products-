import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    discountedPrice: {
      type: Number,
      min: [0, "Price must be positive"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Shoes", "Bags", "Clothing", "Accessories"], // optional enum
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    sizes: [
      {
        size: String,
        alt: Number,
      },
    ],
    colors: [
      {
        name: String,
        code: String,
        stock: Number,
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users_data" },
        rating: { type: Number, min: 0, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Products", productSchema);
export default productModel;
