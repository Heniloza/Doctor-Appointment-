import DOCTOR from "../../models/doctorModel.js";
import SLOT from "../../models/slotModel.js";

export const createTimeSlot = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { date, startTime, endTime, duration, bufferTime } = req.body;

    const doctor = await DOCTOR.findById(doctorId).select("clinicId");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const existingSlot = await SLOT.findOne({
      doctorId,
      date: new Date(date),
      startTime,
      endTime,
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: "Time slot already exists",
      });
    }

    const timeSlot = await SLOT.create({
      doctorId,
      clinicId: doctor.clinicId,
      date: new Date(date),
      startTime,
      endTime,
      duration: duration || 30,
      bufferTime: bufferTime || 0,
    });

    res.status(201).json({
      success: true,
      message: "Time slot created successfully",
      data: timeSlot,
    });
  } catch (error) {
    console.error("Error creating time slot:", error);
    res.status(500).json({
      success: false,
      message: "Error creating time slot",
      error: error.message,
    });
  }
};

export const createBulkTimeSlots = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { date, startTime, endTime, slotDuration, bufferTime } = req.body;

    const doctor = await DOCTOR.findById(doctorId).select("clinicId");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const slots = generateTimeSlots(
      startTime,
      endTime,
      slotDuration || 30,
      bufferTime || 0,
    );

    const timeSlots = slots.map((slot) => ({
      doctorId,
      clinicId: doctor.clinicId,
      date: new Date(date),
      startTime: slot.start,
      endTime: slot.end,
      duration: slotDuration || 30,
      bufferTime: bufferTime || 0,
    }));

    const createdSlots = [];
    for (const slotData of timeSlots) {
      try {
        const slot = await SLOT.create(slotData);
        createdSlots.push(slot);
      } catch (error) {
        if (error.code !== 11000) {
          console.error("Error creating slot:", error);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `${createdSlots.length} time slots created successfully`,
      data: createdSlots,
    });
  } catch (error) {
    console.error("Error creating bulk time slots:", error);
    res.status(500).json({
      success: false,
      message: "Error creating time slots",
      error: error.message,
    });
  }
};
