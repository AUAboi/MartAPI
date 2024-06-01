import express from "express";
import { onlyAdminAccess, onlyAuthorAccess, onlyUserAccess, onlyUsernVendor, onlyVendorAccess, protectRoute, verifiedOnly } from "../middleware/authMiddleware.js";
import { changeOrderStatus, deleteOrder, getAllOrderVendor, getOrderList, orders } from "../controllers/orderController.js";

const order = express.Router();


// Cart routes

order.post("/userOrders",protectRoute,verifiedOnly,onlyUserAccess, orders);
order.get("/getOrderList",protectRoute,verifiedOnly,onlyUserAccess, getOrderList);
order.get("/getAllOrderListVendor",protectRoute,verifiedOnly,onlyVendorAccess, getAllOrderVendor);
order.patch("/changeOrderStatus/:id",protectRoute,verifiedOnly,onlyUsernVendor, changeOrderStatus);
order.delete("/deleteOrder/:id",protectRoute,verifiedOnly,onlyUserAccess, deleteOrder);





export default order;
