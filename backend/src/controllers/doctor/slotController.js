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
      parseInt(slotDuration) || 30,
      parseInt(bufferTime) || 0,
    );

    if (slots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No slots could be generated. Please check your time range.",
      });
    }

    const timeSlots = slots.map((slot) => ({
      doctorId,
      clinicId: doctor.clinicId,
      date: new Date(date),
      startTime: slot.start,
      endTime: slot.end,
      duration: parseInt(slotDuration) || 30,
      bufferTime: parseInt(bufferTime) || 0,
    }));

    const createdSlots = [];
    const errors = [];

    for (const slotData of timeSlots) {
      try {
        const slot = await SLOT.create(slotData);
        createdSlots.push(slot);
      } catch (error) {
        if (error.code === 11000) {
          console.log(
            `Duplicate slot skipped: ${slotData.startTime} - ${slotData.endTime}`,
          )
        } else {
          console.error(
            ` Error creating slot ${slotData.startTime}:`,
            error.message,
          );
          errors.push({
            time: `${slotData.startTime} - ${slotData.endTime}`,
            error: error.message,
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `${createdSlots.length} time slots created successfully`,
      data: createdSlots,
      errors: errors.length > 0 ? errors : undefined,
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

function generateTimeSlots(startTime, endTime, duration, bufferTime = 0) {
  const slots = [];

  const start = parseTime(startTime);
  const end = parseTime(endTime);

   if (start === null || end === null) {
    console.error(" Failed to parse times");
    return [];
  }

  if (start >= end) {
    console.error(" Start time must be before end time");
    return [];
  }

  if (duration <= 0) {
    console.error(" Duration must be positive");
    return [];
  }

  let current = start;
  let slotNumber = 0;

  while (current + duration <= end) {
    const slotStart = formatTime(current);
    const slotEnd = formatTime(current + duration);

    slots.push({
      start: slotStart,
      end: slotEnd,
    });


    current += duration + bufferTime;
    slotNumber++;
  }

  return slots;
}

function parseTime(timeStr) {
  if (!timeStr || typeof timeStr !== "string") {
    console.error(" Invalid time string:", timeStr);
    return null;
  }

  try {
    const cleaned = timeStr.trim().toUpperCase();
    const parts = cleaned.split(" ");
    if (parts.length !== 2) {
      console.error(
        " Invalid time format (expected 'HH:MM AM/PM'):",
        timeStr,
      );
      return null;
    }

    const [time, period] = parts;

    if (period !== "AM" && period !== "PM") {
      console.error(" Invalid period (expected AM or PM):", period);
      return null;
    }

    const timeParts = time.split(":");
    if (timeParts.length !== 2) {
      console.error(" Invalid time format (expected HH:MM):", time);
      return null;
    }

    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error(" Invalid hours or minutes:", { hours, minutes });
      return null;
    }

    if (hours < 1 || hours > 12) {
      console.error(" Hours must be between 1 and 12:", hours);
      return null;
    }

    if (minutes < 0 || minutes > 59) {
      console.error(" Minutes must be between 0 and 59:", minutes);
      return null;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  } catch (error) {
    console.error(" Error parsing time:", error);
    return null;
  }
}

function formatTime(totalMinutes) {
  if (typeof totalMinutes !== "number" || isNaN(totalMinutes)) {
    console.error(" Invalid minutes for formatting:", totalMinutes);
    return null;
  }

  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export const getTimeSlots = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { date, startDate, endDate, isAvailable, isBooked } = req.query;

    const filter = { doctorId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: startOfDay,
        $lt: endOfDay,
      };
    } else if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    if (isBooked !== undefined) {
      filter.isBooked = isBooked === "true";
    }

    const timeSlots = await SLOT.find(filter)
      .sort({ date: 1, startTime: 1 })
      .lean();


    res.status(200).json({
      success: true,
      count: timeSlots.length,
      data: timeSlots,
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching time slots",
      error: error.message,
    });
  }
};

export const updateTimeSlot = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { slotId } = req.params;
    const { isAvailable } = req.body;

    const timeSlot = await SLOT.findOne({
      _id: slotId,
      doctorId,
    });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: "Time slot not found",
      });
    }

    if (timeSlot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify a booked time slot",
      });
    }

    timeSlot.isAvailable = isAvailable;
    await timeSlot.save();

    res.status(200).json({
      success: true,
      message: "Time slot updated successfully",
      data: timeSlot,
    });
  } catch (error) {
    console.error("Error updating time slot:", error);
    res.status(500).json({
      success: false,
      message: "Error updating time slot",
      error: error.message,
    });
  }
};

export const deleteTimeSlot = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { slotId } = req.params;

    const timeSlot = await SLOT.findOne({
      _id: slotId,
      doctorId,
    });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: "Time slot not found",
      });
    }

    if (timeSlot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a booked time slot",
      });
    }

    await SLOT.findByIdAndDelete(slotId);

    res.status(200).json({
      success: true,
      message: "Time slot deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting time slot",
      error: error.message,
    });
  }
};

export const deleteBulkTimeSlots = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { date } = req.body;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await SLOT.deleteMany({
      doctorId,
      isBooked: false,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} time slots deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting time slots:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting time slots",
      error: error.message,
    });
  }
};

export const getScheduleStats = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalSlots, bookedSlots, availableSlots, upcomingSlots] =
      await Promise.all([
        SLOT.countDocuments({ doctorId }),
        SLOT.countDocuments({ doctorId, isBooked: true }),
        SLOT.countDocuments({
          doctorId,
          isAvailable: true,
          isBooked: false,
        }),
        SLOT.countDocuments({
          doctorId,
          date: { $gte: today },
          isAvailable: true,
          isBooked: false,
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalSlots,
        bookedSlots,
        availableSlots,
        upcomingSlots,
      },
    });
  } catch (error) {
    console.error("Error fetching schedule stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching schedule statistics",
      error: error.message,
    });
  }
};
