import express from "express";
import { ratingThreePlus } from "../controllers/ratingThreePlus.js";
const rating3 = express.Router();


// Cart routes

rating3.get("/rating3", ratingThreePlus);





export default rating3;
