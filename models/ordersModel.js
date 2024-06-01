import mongoose, { Mongoose, model } from "mongoose";

const ordersSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter vendorId"],
  },
  paymentType: {
    type: mongoose.Schema.Types.String,
    default: 'cash'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter product Id"],
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter vendor Id"],
  },
  productName: {
    type: String,
    required: [true, "Please enter product name"],
  },
  userName:{
    type:String,
    required:[true,"Please enter name"]
  },
  email:{
    type:String,
    required:[true,"Please enter your email"]
  },
  image: {
    type: String,
    required: [true, "Please enter image"],
  },
  mobile:{
    type:String,
    required:[true,"Please enter your mobile number"]
  },
  price: {
    type: Number,
    required: [true, "Please enter price per Item"],
  },
  quantity: {
    type: Number,
    required: [true, "Please enter quantity"],
  },

  status: {
    type: String,
    default: "Pending",
  },
  size: {
    type: String,
    required: [true, "Please enter size of item"],
  },
  address:{
    type:String,
    required:[true,"Please enter shipping address"]
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

const Orders = mongoose.model("order", ordersSchema);

export default Orders;
