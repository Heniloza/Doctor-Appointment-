import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["user", "doctor", "clinic"],
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "appointment_confirmed",
        "new_appointment",
        "appointment_cancelled",
        "appointment_reminder",
        "prescription_ready",
        "payment_success",
        "general",
      ],
    },
    icon: {
      type: String,
      default: "bell",
      enum: [
        "calendar",
        "check",
        "x",
        "bell",
        "pill",
        "dollar",
        "user",
        "stethoscope",
        "building",
        "clock",
      ],
    },
    link: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const NOTIFICATION = mongoose.model("Notification", notificationSchema);

export default NOTIFICATION;
