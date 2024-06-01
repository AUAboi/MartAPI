import express from "express";
import { onlyAdminAccess, onlyUserAccess, protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { contactUs, deleteMessage, getMessages, reportReviewed, reports, sellerReport } from "../controllers/contactUsController.js";
const contact = express.Router();

contact.post("/contactUs",protectRoute,verifiedOnly,onlyUserAccess,contactUs);
contact.get("/getMessages",protectRoute,verifiedOnly,onlyAdminAccess,getMessages);
contact.delete("/deleteMessage/:id",protectRoute,verifiedOnly,onlyAdminAccess,deleteMessage);
contact.post("/support/contactUs",protectRoute,verifiedOnly,onlyUserAccess,sellerReport);
contact.get("/support/reports",protectRoute,verifiedOnly,onlyAdminAccess,reports);
contact.patch("/support/reports/:id",protectRoute,verifiedOnly,onlyAdminAccess,reportReviewed);

export default contact;