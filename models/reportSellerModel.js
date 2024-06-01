import mongoose, { model } from "mongoose";

const sellerReportSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  vendorId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  subject: {
    type: String,
    required: [true, "Please enter subject"],
  },
  message: {
    type: String,
    required: [true, "Message cannot be blank"],
  },
  vendorName: {
    type: String,
    required: [true, "vendor name cannot be blank"],
  },
  photo: {
    type: String,
    required: [true, "pic cannot be blank"],
  },
  isReviewed:{
    type:Boolean,
    default:false
  }
});

const SellerReport = mongoose.model("sellerReport", sellerReportSchema);

export default SellerReport;
