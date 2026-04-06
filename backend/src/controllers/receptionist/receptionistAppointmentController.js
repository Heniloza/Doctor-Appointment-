import APPOINTMENT from "../../models/appointmentModel.js";

export const getReceptionistAppointmentsController = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const doctorId = req.receptionist.doctorId;

    let filter = { doctorId };

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await APPOINTMENT.find(filter)
      .populate("userId", "name email phone profilePicture")
      .populate("doctorId", "name email specialization")
      .populate("clinicId", "clinicName")
      .sort({ appointmentDate: -1, startTime: -1 })
      .limit(100);

    let filteredAppointments = appointments;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredAppointments = appointments.filter(
        (apt) =>
          apt.userId?.name?.toLowerCase().includes(searchLower) ||
          apt.userId?.email?.toLowerCase().includes(searchLower) ||
          apt.userId?.phone?.includes(search),
      );
    }

    res.status(200).json({
      success: true,
      count: filteredAppointments.length,
      data: filteredAppointments,
    });
  } catch (error) {
    console.error("Get receptionist appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const doctorId = req.receptionist.doctorId;

    const appointment = await APPOINTMENT.findOne({
      _id: appointmentId,
      doctorId,
    })
      .populate("userId", "name email phone profilePicture")
      .populate("doctorId", "name email specialization")
      .populate("clinicId", "clinicName address");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied",
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
    });
  }
};

export const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const doctorId = req.receptionist.doctorId;

    const validStatuses = ["confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const appointment = await APPOINTMENT.findOne({
      _id: appointmentId,
      doctorId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied",
      });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await APPOINTMENT.findById(appointmentId)
      .populate("userId", "name email phone")
      .populate("doctorId", "name specialization")
      .populate("clinicId", "clinicName");

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
    });
  }
};

export const getTodayAppointmentsController = async (req, res) => {
  try {
    const doctorId = req.receptionist.doctorId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await APPOINTMENT.find({
      doctorId,
      appointmentDate: { $gte: today, $lt: tomorrow },
    })
      .populate("userId", "name email phone profilePicture")
      .populate("doctorId", "name specialization")
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
    });
  }
};

export const getAppointmentStatsController = async (req, res) => {
  try {
    const doctorId = req.receptionist.doctorId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalToday, confirmed, completed, cancelled, pending] =
      await Promise.all([
        APPOINTMENT.countDocuments({
          doctorId,
          appointmentDate: { $gte: today, $lt: tomorrow },
        }),
        APPOINTMENT.countDocuments({
          doctorId,
          appointmentDate: { $gte: today, $lt: tomorrow },
          status: "confirmed",
        }),
        APPOINTMENT.countDocuments({
          doctorId,
          appointmentDate: { $gte: today, $lt: tomorrow },
          status: "completed",
        }),
        APPOINTMENT.countDocuments({
          doctorId,
          appointmentDate: { $gte: today, $lt: tomorrow },
          status: "cancelled",
        }),
        APPOINTMENT.countDocuments({
          doctorId,
          appointmentDate: { $gte: today, $lt: tomorrow },
          status: "pending",
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalToday,
        confirmed,
        completed,
        cancelled,
        pending,
      },
    });
  } catch (error) {
    console.error("Get appointment stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
};

export const searchPatientsController = async (req, res) => {
  try {
    const { search } = req.query;
    const doctorId = req.receptionist.doctorId;

    if (!search || search.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const appointments = await APPOINTMENT.find({ doctorId })
      .populate("userId", "name email phone profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    const searchLower = search.toLowerCase();
    const uniquePatients = new Map();

    appointments.forEach((apt) => {
      if (apt.userId) {
        const patient = apt.userId;
        const matches =
          patient.name?.toLowerCase().includes(searchLower) ||
          patient.email?.toLowerCase().includes(searchLower) ||
          patient.phone?.includes(search);

        if (matches && !uniquePatients.has(patient._id.toString())) {
          uniquePatients.set(patient._id.toString(), patient);
        }
      }
    });

    const results = Array.from(uniquePatients.values());

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Search patients error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching patients",
    });
  }
};
