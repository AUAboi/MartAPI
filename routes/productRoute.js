import express from "express";
import { onlyAuthorAccess, onlyUserAccess, onlyUsernVendor, onlyVendorAccess, protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { deleteProduct, deleteReview, getProduct, getProducts, insertReview, productListing, updateProduct } from "../controllers/productListingController.js";
const product = express.Router();


// Lisitng the user product 
product.post("/productListing",protectRoute,verifiedOnly,onlyVendorAccess, productListing);
product.post("/updateProduct/:id",protectRoute,verifiedOnly,onlyVendorAccess, updateProduct);
product.get("/getProducts",protectRoute,verifiedOnly,onlyVendorAccess, getProducts);
product.get("/getProduct/:id",protectRoute,verifiedOnly,onlyUsernVendor, getProduct);
product.delete("/deleteProduct/:id",protectRoute,verifiedOnly, deleteProduct);



product.post("/leaveReview/:id",protectRoute,verifiedOnly,onlyUserAccess, insertReview);
product.delete("/deleteReview/:id",protectRoute,verifiedOnly,onlyUserAccess, deleteReview);




export default product;
