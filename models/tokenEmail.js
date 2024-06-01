import mongoose, { model } from "mongoose";

const tokenEmailSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"user"
    },
    verificationToken: {
      type: String,
      default:""
    },
    passwordResetToken: {
      type: String,
      default:""
    },
    loginToken: {
      type: String,
      default:""
    },
    createdAt: {
      type:Date,
      required:true
    },
    expireAt: {
      type: Date,
      required:true
    },
  },
  
);

const TokenEmail = mongoose.model("Token", tokenEmailSchema);

export default TokenEmail;
