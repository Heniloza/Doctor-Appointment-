import APPOINTMENT from "../../models/appointmentModel.js";
import SLOT from "../../models/slotModel.js";

export const getDoctorAppointmentsController = async (req, res) => {
  try {
    const { status, date } = req.query;

    const filter = { doctorId: req.doctor._id };

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.appointmentDate = {
        $gte: startOfDay,
        $lt: endOfDay,
      };
    }

    const appointments = await APPOINTMENT.find(filter)
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("clinicId", "clinicName address city phone email")
      .populate("slotId")
      .sort({ appointmentDate: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

export const getDoctorAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await APPOINTMENT.findOne({
      _id: req.params.id,
      doctorId: req.doctor._id,
    })
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("clinicId", "clinicName address city phone email")
      .populate("slotId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

export const completeAppointmentController = async (req, res) => {
  try {
    const { diagnosis, consultationNotes, prescription } = req.body;

    if (!diagnosis) {
      return res.status(400).json({
        success: false,
        message: "Diagnosis is required",
      });
    }

    const appointment = await APPOINTMENT.findOne({
      _id: req.params.id,
      doctorId: req.doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot complete a cancelled appointment",
      });
    }

    appointment.diagnosis = diagnosis;
    appointment.consultationNotes = consultationNotes || "";
    appointment.prescription = prescription || [];
    appointment.status = "completed";

    await appointment.save();

    const updatedAppointment = await APPOINTMENT.findById(appointment._id)
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("clinicId", "clinicName address city phone email")
      .populate("slotId");

    res.status(200).json({
      success: true,
      message: "Consultation completed successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Complete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error completing consultation",
      error: error.message,
    });
  }
};

export const cancelDoctorAppointmentController = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const appointment = await APPOINTMENT.findOne({
      _id: req.params.id,
      doctorId: req.doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed appointment",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    await SLOT.findByIdAndUpdate(appointment.slotId, {
      isBooked: false,
      isAvailable: true,
    });

    appointment.status = "cancelled";
    appointment.cancelledBy = "doctor";
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();

    await appointment.save();

    const updatedAppointment = await APPOINTMENT.findById(appointment._id)
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("clinicId", "clinicName address city phone email")
      .populate("slotId");

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};

export const updatePrescriptionController = async (req, res) => {
  try {
    const { prescription } = req.body;

    const appointment = await APPOINTMENT.findOne({
      _id: req.params.id,
      doctorId: req.doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.prescription = prescription || [];
    await appointment.save();

    const updatedAppointment = await APPOINTMENT.findById(appointment._id)
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("clinicId", "clinicName address city phone email")
      .populate("slotId");

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Update prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message,
    });
  }
};

export const getTodayAppointmentsController = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await APPOINTMENT.find({
      doctorId: req.doctor._id,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("userId", "name email phone profilePicture")
      .populate("clinicId", "clinicName")
      .populate("slotId")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get today appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching today's appointments",
      error: error.message,
    });
  }
};
