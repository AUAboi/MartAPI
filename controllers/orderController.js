import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Orders from "../models/ordersModel.js";
import Cart from "../models/cartModel.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const orders = asyncHandler(async (req, res) => {
  const {
    id,
    address,
    email,
    image,
    mobile,
    name,
    price,
    quantity,
    paymentType,
    token,
    size,
    value,
  } = req.body;
  const productId = value;


  if (paymentType === "card") {
    try {
      const charge = await stripe.charges.create({
        amount: price * quantity * 100,
        currency: 'pkr',
        source: token.id,
        description: 'Charge on API',
      });
  
    } catch (err) {
      console.error('Error processing payment:', err);
      let message = 'An error occurred while processing your payment.';
  
      if (err.type === 'StripeCardError') {
        message = err.message;
      }
  
      res.status(500).send(message);
    }
  }
  

  if (
    !address ||
    !email ||
    !image ||
    !mobile ||
    !name ||
    !price ||
    !quantity ||
    !size ||
    !productId
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const product = await Product.findById(productId);
  // console.log(product)
  if (!product) {
    res.status(404);
    throw new Error("item your are trying order is may be deleted");
  }

  const totalStock = product.totalStock;
  if (totalStock === 0) {
    res.status(400);
    throw new Error("No stock available, please try when available");
  }
  if (totalStock < quantity) {
    res.status(400);
    throw new Error("Limited stock available, please try again");
  }

  const order = await Orders.create({
    userId: req.user._id,
    productId: product._id,
    vendorId: product.vendorId,
    productName: product.productName,
    userName: name,
    email: email,
    image: product.image,
    mobile: mobile,
    price: price,
    quantity: quantity,
    size: size,
    address: address,
    paymentType: paymentType,
    createdAt: Date.now(),
    expireAt: Date.now() + 10 * (60 * 1000),
  });

  // console.log(order)
  if (order) {
    await Cart.updateOne(
      { userId: req.user._id },
      { $pull: { cartItems: { id: id } } }
    );
    const updated = await Product.updateOne(
      { _id: productId },
      { $set: { totalStock: totalStock - quantity } }
    );
    if (updated) {
      res
        .status(201)
        .json({ message: "Your order has been successfully placed" });
    } else {
      res.status(500);
      throw new Error("Internal server err, please try again");
    }
  } else {
    res.status(500);
    throw new Error("Internal server err, please try again");
  }
});

export const getOrderList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Orders.find({ userId: userId }).sort("-createdAt");
  // console.log(orders)
  if (orders.length === 0 || !orders) {
    res.status(404);
    throw new Error("No order list found");
  }
  res.status(200).json(orders);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const orderQuantity = await Orders.findById(id);
  const quantity = orderQuantity.quantity;
  const productId = orderQuantity.productId;

  const product = await Product.findById(productId);
  const totalStock = product.totalStock;

  const order = await Orders.findOne({
    _id: id,
    expireAt: { $gt: Date.now() },
  });
  if (!order) {
    res.status(400);
    throw new Error(
      "You can only cancel within 10 mintutes after order placing"
    );
  }
  const updated = await Product.updateOne(
    { _id: productId },
    { $set: { totalStock: totalStock + quantity } }
  );
  await order.deleteOne();
  if (updated) {
    res.status(200).json({ message: "Successfuly canceled" });
  } else {
    res.status(500);
    throw new Error("Server err, please try again");
  }
});

export const getAllOrderVendor = asyncHandler(async (req, res) => {
  const id = req.user._id;
  console.log(id);
  const allOrders = await Orders.find({ vendorId: id });
  if (allOrders.length === 0 || !allOrders) {
    res.status(404);
    throw new Error("You have no order yet");
  }
  if (allOrders) {
    res.status(200).json(allOrders);
  } else {
    res.status(500);
    throw new Error("Server err, please try again");
  }
});

export const changeOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { statusFromVendor } = req.body;

  const item = await Orders.findById(id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const updated = await Orders.updateOne(
    { _id: id },
    { $set: { status: statusFromVendor } }
  );
  console.log(updated);
  if (updated) {
    res.status(200).json({ message: "Status has been updated" });
  } else {
    res.status(500);
    throw new Error("Server err, please try again");
  }
});
