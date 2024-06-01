import mongoose, { model } from "mongoose";

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
//   size:{
// type:String,
// required:[true,"please enter the size for product"]
//   },
  cartItems: {
    type: Array,
    default: [
      {
        type:String,
        value:""
      }
    ],
  },
});

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
