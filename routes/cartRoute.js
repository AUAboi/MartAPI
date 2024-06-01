import express from "express";
import { onlyAdminAccess, onlyUserAccess, protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { addToCart, deleteFromCart, getCartItem, getFromCart } from "../controllers/cartController.js";
const cart = express.Router();


// Cart routes

cart.post("/addtoCart/:id",protectRoute,verifiedOnly,onlyUserAccess, addToCart);
cart.get("/getFromCart",protectRoute,verifiedOnly,onlyUserAccess, getFromCart);
cart.get("/getCartItem/:id",protectRoute,verifiedOnly,onlyUserAccess, getCartItem);
cart.delete("/deleteFromCart/:id",protectRoute,verifiedOnly,onlyUserAccess, deleteFromCart);





export default cart;
