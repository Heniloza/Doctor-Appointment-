import mongoose from "mongoose";

const receptionistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    fcmToken: {
      type: String,
    },
    role:{
      type:String,
      default:"receptionist"
    }
  },
  { timestamps: true },
);


const RECEPTIONIST = mongoose.model("Receptionist", receptionistSchema);

export default RECEPTIONIST;
