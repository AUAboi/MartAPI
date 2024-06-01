import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, hashToken } from "../utils/index.js";
import parser from "ua-parser-js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import TokenEmail from "./../models/tokenEmail.js";
import Cryptr from "cryptr";
import Product from './../models/productModel.js';
const cryptr = new Cryptr(`${process.env.CRYPTR}`);

// SignUp user
export const signUpUser = asyncHandler(async (req, res) => {
  const { name, email, password, roleType, document, ntn } = req.body;
  if (roleType === "Vendor") {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be upto 8 characters");
    }
    if (!document) {
      res.status(400);
      throw new Error("Cnic image is required");
    }
    if (ntn.length < 13) {
      res.status(400);
      throw new Error("Ntn number must be 13 digit");
    }
    if (ntn.includes("-")) {
      res.status(400);
      throw new Error("Enter ntn without dashes");
    }
  }
  if (roleType === "User") {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be upto 8 characters");
    }
  }

  //*check if user email already register
  const userExist = await User.findOne({ email }); //this will return true or false, & using model
  if (userExist) {
    res.status(400);
    throw new Error("Email is already registered");
  }
  //*Getting user logged browsers
  const ua = parser(req.headers["user-agent"]);
  const userLoggedFrom = [ua.ua];

  //*create new user if not exist
  let user;
  if (roleType === "Vendor") {
    user = await User.create({
      name,
      email,
      password,
      ntn,
      role:"pending",
      cnicImage:document,
      userLoggedFrom,
    });
  }
  if (roleType === "User") {
    user = await User.create({ name, email, password, userLoggedFrom });
  }

  //*Generate token
  const token = generateToken(user._id);

  //*send cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //86400 = 1 day then in miliseconds
    sameSite: "none",
    secure: true,
  });

  if (user) {
      const {
        _id,
        name,
        email,
        photo,
        mobile,
        bio,
        role,
        ntn,
        isVerified,
        userLoggedFrom,
      } = user;

      res.status(201).json({
        _id,
        name,
        email,
        photo,
        mobile,
        bio,
        role,
        ntn,
        isVerified,
        userLoggedFrom,
      });
    
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});
// SignIn User
export const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist, please signup");
  }
  // console.log(user)
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Email or Password incorrect");
  }
  // Trigger 2FA for Unknown device loggedIn
  const ua = parser(req.headers["user-agent"]);
  const currentlyLoggedFrom = ua.ua;
  const allowedAgent = user.userLoggedFrom.includes(currentlyLoggedFrom);

  if (!allowedAgent) {
    // const otp = Math.floor(10000 + Math.random() * 900000);
    let digits = '0123456789'; 
    let otp = ''; 
    for (let i = 0; i < 6; i++) { 
      otp += digits[Math.floor(Math.random() * 10)]; 
  }
    console.log("otp by for loop",otp);

    // encryt and save it to the db
    const encryptedOtp = cryptr.encrypt(otp.toString());

    // Delete token if it exists in the database
    const userToken = await TokenEmail.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
      // console.log(userToken)
    }
    // Save it to the database
    await new TokenEmail({
      userId: user._id,
      loginToken: encryptedOtp,
      createdAt: Date.now(),
      expireAt: Date.now() + 5 * (60 * 1000),
    }).save();

    res.status(400);
    throw new Error("New device detected, enter code sent to your email");
  }

  // Generate Token
  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    // send cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //86400 = 1 day then in miliseconds
      sameSite: "none",
      secure: true,
    });
    const {
      _id,
      name,
      email,
      photo,
      mobile,
      bio,
      role,
      isVerified,
      userLoggedFrom,
    } = user;

    res.status(200).json({
      _id,
      name,
      email,
      photo,
      mobile,
      bio,
      role,
      isVerified,
      userLoggedFrom,
      token,
    });
  } else {
    res.status(500);
    throw new Error("Something went wrong, Try again");
  }
});

// sending otp for login to user email
export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // find otp if exist in database
  let userToken = await TokenEmail.findOne({ userId: user._id });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expires token, please login again");
  }

  const loginOTP = userToken.loginToken;
  // added for more security
  if (!loginOTP) {
    res.status(400);
    throw new Error("Please login, to generate OTP");
  }
  const otp = cryptr.decrypt(loginOTP.toString());

  // const link = `This code is valid for 5 minutes ${otp}`;
console.log("otp from dp",otp)
  const subject = "Login OTP";
  const sendTo = email;
  const sendFrom = process.env.EMAIL_USERNAME;
  const replyTo = "noreply@noreply.com";
  const template = "loginOtp";
  const name = user.name;
  const link = "#";
  const p1 = `Use the below code to login to your account`;
  const p2 = "This is valid for 5 minutes";
  const btn_text = `${otp}`;
  try {
    await sendEmail(
      subject,
      sendTo,
      sendFrom,
      replyTo,
      template,
      name,
      link,
      p1,
      p2,
      btn_text
    );
    res.status(200).json({
      message: "Login code sent to your email",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not send, try again");
  }
});

// login with otp send to gmail
export const loginWithOTP = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;
console.log(email,otp)
  // if (otp.length < 6) {
  //   res.status(400);
  //   throw new Error("OTP must be 6 characters");
  // }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // find user login otp
  const userOTP = await TokenEmail.findOne({
    userId: user.id,
    expireAt: { $gt: Date.now() },
  });

  if (!userOTP) {
    res.status(400);
    throw new Error("Invalid or expires token");
  }

  const decryptLoginOtp = cryptr.decrypt(userOTP.loginToken);

  if (otp !== decryptLoginOtp) {
    res.status(400);
    throw new Error("Incorrect login code");
  } else {
    // register the new logged device
    const ua = parser(req.headers["user-agent"]);
    const newDeviceLogged = ua.ua;
    user.userLoggedFrom.push(newDeviceLogged);
    await user.save();

    // Generate token and send it to the frontend

    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //for one day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, mobile, photo, bio, role, isVerified } = user;
    res
      .status(200)
      .json({ _id, name, email, mobile, photo, bio, role, isVerified });
  }
});

// Verification email
export const sendVerificationMail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  // Delete the token if exist in database
  let token = await TokenEmail.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Generate verification token and saving it to db
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash token and save
  const hashedToken = hashToken(verificationToken);
  // console.log(hashedToken)
  await new TokenEmail({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expireAt: Date.now() + 10 * (60 * 1000), // expires after 10 mint
  }).save();

  // Making a verification url
  const verificationUrl = `${process.env.FRONTEND_URL}/verifyUser/${verificationToken}`;
  // console.log(verificationUrl)
  // send email

  const subject = "Account Verification";
  const sendTo = req.user.email;
  const sendFrom = process.env.EMAIL_USERNAME;
  const replyTo = "noreply@noreply.com";
  const template = "accountVerfication";
  const name = user.name;
  const link = verificationUrl;
  const p1 = "Verify your account";
  const p2 = "This link is valid for 10 minutes";
  const btn_text = "Verify account";

  try {
    await sendEmail(
      subject,
      sendTo,
      sendFrom,
      replyTo,
      template,
      name,
      link,
      p1,
      p2,
      btn_text
    );
    res.status(200).json({ message: "Verification Email has sent" });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Email not send, Try again");
  }
});

// verify the user from false to true
export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  const hashedToken = hashToken(verificationToken);
  // console.log(hashedToken)

  const userToken = await TokenEmail.findOne({
    verificationToken: hashedToken,
    expireAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token");
  }

  // Finding user from db to check it is already verified
  const user = await User.findOne({ _id: userToken.userId });
  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }
  //  if user is not verify then verify the user
  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "Account verification successful" });
});

// LogIn User
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  // console.log("logout")
  res.status(200).json({ message: "Logout Successfully" });
});

// Get User From database
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const {
      _id,
      name,
      email,
      photo,
      mobile,
      bio,
      role,
      isVerified,
      userLoggedFrom,
    } = user;

    res.status(200).json({
      _id,
      name,
      email,
      photo,
      mobile,
      bio,
      role,
      isVerified,
      userLoggedFrom,
    });
  } else {
    req.status(404);
    throw new Error("User not found");
  }
});

// Update user profile
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const {
      // as we are updating the user we dont need of id & email to update
      name,
      // email,
      photo,
      mobile,
      bio,
      role,
      isVerified,
    } = user;
    // user.email = email;
    user.name = req.body.uName || name;
    user.photo = req.body.photo || photo;
    user.mobile = req.body.mobile || mobile;
    user.bio = req.body.bio || bio;
    user.role = req.body.role || role;
    user.isVerified = req.body.isVerified || isVerified;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      mobile: updatedUser.mobile,
      bio: updatedUser.bio,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const user =await User.findById(req.params.id);
  console.log(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    message: "User deleted successfully",
  });
});

// get all users data
export const getUsers = asyncHandler(async (req, res) => {
  // res.send("get User")

  const users = await User.find().sort("-createdAt").select("-password");

  if (!users) {
    res.status(500);
    throw new Error("Somethng went wrong");
  }
  res.status(200).json(users);
});

// check if user is logged in  it will return true or false
export const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verifying token
  const verified = jwt.verify(token, process.env.JWT_SECRETS);

  if (verified) {
    return res.json(true);
  }
  res.json(false);
});

// updating the role
export const upgradeRole = asyncHandler(async (req, res) => {
  const { id, role } = req.body;
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  console.log(role)
  if(role==="suspended"){
    const allListing = await Product.deleteMany({vendorId:id})
    if(allListing.length===0 || !allListing){
      res.status(404)
      throw new Error("Successfully deleted user lisitng")
    }
  }



  user.role = role;
  await user.save();
  res.status(200).json({
    message: `User role changed to ${user.role}`,
  });
});

// sending automatic email to users - it will discuss later
export const sendAutoMail = asyncHandler(async (req, res) => {
  const { subject, sendTo, url } = req.body;
  console.log(subject);
  console.log(sendTo);
  // const subject = "No subject";
  // const sendTo = "m.nasir712.d@gmail.com";

  // const url = "";

  if (!subject || !sendTo || !replyTo || !template) {
    res.status(400);
    throw new Error("Parameters for mails are miss");
  }

  // Find user by email from database
  const user = await User.findOne({ email: sendTo });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const sendFrom = process.env.EMAIL_USERNAME;
  const replyTo = "noreply@noreply.com";
  const template = "autoEmail";
  const name = user.name;
  const link = `${process.env.FRONTEND_URL}${url}`;
  const p1 = `${
    (subject === "Password Changed -" &&
      "This it to notify that your account password has changed") ||
    (subject === "Account Status -" &&
      "Your account status has been changed by admin")
  }`;
  const p2 = "Visit your account to check";
  const btn_text = `${
    (url === "/forgotPassword" && "Reset password") ||
    (url === "/login" && "Login")
  }`;

  try {
    await sendEmail(
      subject,
      sendTo,
      sendFrom,
      replyTo,
      template,
      name,
      link,
      p1,
      p2,
      btn_text
    );
    res.status(200).json({ message: "Email has sent" });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Email not send, Try again");
  }
});

// function for forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email you are trying to reset is not register yet");
  }

  // find the token and delete that token
  const token = await TokenEmail.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  // create a reset token and save it to the database
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(`reset token is ${resetToken}`);
  const hashedToken = hashToken(resetToken);
  await new TokenEmail({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expireAt: Date.now() + 5 * (60 * 1000), //valid for 5 minutes
  }).save();

  // create a reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  // send email
  const subject = "Reset password request";
  const sendTo = email;
  const sendFrom = process.env.EMAIL_USERNAME;
  const replyTo = "noreply@noreply.com";
  const template = "forgotPassword";
  const name = user.name;
  const link = resetUrl;
  const p1 = "This it to notify that your account password has changed";
  const p2 =
    "if you did not initiate this, kindly reset your password immediately";
  const btn_text = "Reset password";

  try {
    await sendEmail(
      subject,
      sendTo,
      sendFrom,
      replyTo,
      template,
      name,
      link,
      p1,
      p2,
      btn_text
    );
    res.status(200).json({ message: "Reset link send to your mail account" });
  } catch (error) {}
});

// function for reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  console.log(resetToken);
  console.log(password);

  if (!password || password.length < 8) {
    res.status(400);
    throw new Error("Password should 8 characters");
  }
  const hashedToken = hashToken(resetToken);

  const userToken = await TokenEmail.findOne({
    passwordResetToken: hashedToken,
    // expireAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expire token");
  }

  // find user
  const user = await User.findOne({ _id: userToken.userId });

  // resetting the password
  user.password = password;
  await user.save();

  res
    .status(200)
    .json({ message: "Password reset successfully, please login" });
});

// function for password change by the user
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // console.log(oldPassword, newPassword);
  if (!oldPassword || !newPassword || newPassword.length < 8) {
    res.status(400);
    throw new Error("Password is require & should 8 characters");
  }

  // we will get id as it is the protected route
  const id = req.user._id;
  const user = await User.findById(id);

  if (!user) {
    //this error checking is not necessary as the user is already logged in so no need to check if the user is exist
    res.status(404);
    throw new Error("User does not exist");
  }
  // // check if the password is previos password in db
  // const previousPassword = await bcrypt.compare(newPassword, user.password);
  // console.log(previousPassword);
  // if (user && previousPassword) {
  //   res.status(400);
  //   throw new Error("New password can't be previos password");
  // }
  // check if the password is correct in db
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  console.log(passwordIsCorrect);
  // save new password if old password is correct
  if (user && passwordIsCorrect) {
    user.password = newPassword;
    await user.save();
    // here we will call the function for sending email
    res.status(200).json({ message: "Password changed successfully," });
  } else {
    res.status(400);
    throw new Error("Old password is wrong");
  }
});
