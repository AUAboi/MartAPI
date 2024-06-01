import express from "express";
import { onlyAdminAccess, onlyAuthorAccess, protectRoute } from "../middleware/authMiddleware.js";
import { signUpUser, signInUser, logoutUser, getUser, updateUser, deleteUser, getUsers, loginStatus, upgradeRole, sendAutoMail, sendVerificationMail, verifyUser, forgotPassword, resetPassword, changePassword, sendOTP, loginWithOTP } from "../controllers/userController.js"; //this is the last statement in imports
const router = express.Router();


// Sign up login and logout route 
router.post("/signUp", signUpUser);
router.post("/signIn", signInUser);
router.get("/logout", logoutUser);

// User profile data getting route 
router.get("/profile",protectRoute, getUser);

// User can update his profile data like mobile number name etc 
router.patch("/updateProfile",protectRoute, updateUser);

// Admin can delete user by passing id as parameter 
router.delete("/:id",protectRoute,onlyAdminAccess, deleteUser);

// Author/ vendor can see the user 
router.get("/getUsers",protectRoute,onlyAdminAccess, getUsers);

// Login status for showing data 
router.get("/loginStatus", loginStatus);

// changing the user role 
router.post("/upgradeRole",protectRoute,onlyAdminAccess, upgradeRole);

// email send route 
router.post("/sendAutoMail",protectRoute, sendAutoMail);

// email send route 
router.post("/sendVerificationMail",protectRoute, sendVerificationMail);

// User verify email 
router.patch("/verifyUser/:verificationToken", verifyUser); // we can protect this route if want

// forgot password 
router.post("/forgotPassword", forgotPassword); 

// reset password 
router.patch("/resetPassword/:resetToken", resetPassword); 

// change password 
router.patch("/changePassword",protectRoute, changePassword); 

// send login otp 
router.post("/sendOTP/:email", sendOTP); 

// login with code send to gmail 
router.post("/loginWithOTP/:email", loginWithOTP); 

export default router;
