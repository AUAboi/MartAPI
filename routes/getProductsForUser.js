import express from "express";
import { protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { getAllProductsForUser } from "../controllers/getAllProductsForUser.js";
const getAllProducts = express.Router();


// get All products routes

getAllProducts.get("/getAllProductsForUser",protectRoute,verifiedOnly, getAllProductsForUser);




export default getAllProducts;
