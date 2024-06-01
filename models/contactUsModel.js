import mongoose, { model } from "mongoose";

const contactUsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  image:{
    type: String,
    required: [true, "Please enter image"],
  },
  subject: {
    type: String,
    required: [true, "Please enter subject"],
  },
  message: {
    type: String,
    required: [true, "Message cannot be blank"],
  },
});

const ContactUs = mongoose.model("contact", contactUsSchema);

export default ContactUs;
