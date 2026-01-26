import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String, 
      required: true,
    },
    duration: {
      type: Number,
      default: 30,
    },
    bufferTime: {
      type: Number, 
      default: 0,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  { timestamps: true },
);

slotSchema.index({ doctorId: 1, date: 1, startTime: 1 });
slotSchema.index({ clinicId: 1, date: 1 });
slotSchema.index({ isBooked: 1, isAvailable: 1 });

slotSchema.index(
  { doctorId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

const SLOT = mongoose.model("Slot", slotSchema);

export default SLOT;