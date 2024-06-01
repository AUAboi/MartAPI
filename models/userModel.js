import mongoose, { model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    photo: {
      type: String,
      required: [true, "Please add photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    mobile: {
      type: String,
      default: "+923000000000",
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      default: "user", //user vendor admin & suspended
    },
    ntn:{
      type:String,
default:""
    },
    cnicImage:{
      type:String,
      default:""
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userLoggedFrom: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    minimize: false, // if user does not enter name then it will reflect in mongoDb
  }
);

// Encrypt password before saving it to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
});

const User = mongoose.model("User", userSchema);

export default User;