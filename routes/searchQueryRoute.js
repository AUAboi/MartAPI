import express from "express";
import { onlyUserAccess, protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { query } from "../controllers/searchQueryController.js";
const searchQuery = express.Router();


// Search query by name
searchQuery.get("/query/:text",protectRoute,verifiedOnly,onlyUserAccess, query);




export default searchQuery;
