import express from "express";
import { protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { get30Discount, get50Discount } from "../controllers/discountController.js";
import { onlyUserAccess } from './../middleware/authMiddleware.js';

const discount = express.Router();


// get 50% discount

discount.get("/get50Discount",protectRoute,verifiedOnly,onlyUserAccess,get50Discount);
discount.get("/get30Discount",protectRoute,verifiedOnly,onlyUserAccess,get30Discount);




export default discount;
