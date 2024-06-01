import mongoose, { Mongoose, model } from "mongoose";

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please enter major category"],
      trim: true,
    },
    subCategory: {
      type: String,
      required: [true, "Please enter sub_category"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter price tag"],
      trim: true,
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: null,
    },
    size: {
      type: String,
      required:[true,"please enter the size for product"]
    },
    totalStock: {
      type: Number,
      required: [true, "Please enter available stock"],
    },
    productDescription: {
      type: String,
      required: [true, "Please enter description for your listing"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please choose image for listing"],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    rating: {
      type: Array,
      default: [],
    },
    storeName: {
      type: String,
      required: [true, "Store name is not entered"],
      ref: "user",
    },
  },
  {
    timestamps: true,
    minimize: false, // if user does not enter name then it will reflect in mongoDb
  }
);

const Product = mongoose.model("product", productSchema);

export default Product;
