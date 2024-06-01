import express from "express";
import {  protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { getCategory, getCategorynSubCategory } from "../controllers/categoryController.js";

const category = express.Router();


// Category routes

category.get("/:category/:subCategory",protectRoute,verifiedOnly, getCategorynSubCategory);
category.get("/:category",protectRoute,verifiedOnly, getCategory);






export default category;
