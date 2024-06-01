import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      res.status(401); //not authorized
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRETS);
    // find user id from token
    const user = await User.findById(verifyToken.id).select("-password");

    // if no user find
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // if user is suspend
    if (user.role === "suspended") {
      res.status(400);
      throw new Error("User is suspended, please contact support");
    }

    // if user is suspend
    if (user.role === "pending") {
      res.status(400);
      throw new Error("Your account is under verification");
    }

    req.user = user;

    next();
  
});

export const onlyAdminAccess = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("User not authorized as an admin");
  }
});

export const onlyAuthorAccess = asyncHandler(async (req, res, next) => {
  if (req.user.role === "vendor" || req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("User not authorized as vendor");
  }
});
export const onlyVendorAccess = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "vendor") {
    next();
  } else {
    res.status(401);
    throw new Error("User not authorized as an vendor/seller");
  }
});
export const onlyUserAccess = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res.status(401);
    throw new Error("User not authorized as customer");
  }
});
export const onlyUsernVendor = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "user" || req.user.role==="vendor") {
    next();
  } else {
    res.status(401);
    throw new Error("User not authorized as customer");
  }
});

export const verifiedOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error("Your account is not verified, please verify");
  }
});
