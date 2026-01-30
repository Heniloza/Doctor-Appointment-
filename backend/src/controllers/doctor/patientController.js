import APPOINTMENT from "../../models/appointmentModel.js";
import USER from "../../models/userModel.js";

export const getDoctorPatientsController = async (req, res) => {
  try {
    const { search } = req.query;

    const appointments = await APPOINTMENT.find({
      doctorId: req.doctor._id,
    }).distinct("userId");

    let query = { _id: { $in: appointments } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await USER.find(query).select("-password");

    const patientsWithCount = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await APPOINTMENT.countDocuments({
          doctorId: req.doctor._id,
          userId: patient._id,
        });

        return {
          ...patient.toObject(),
          appointmentCount,
        };
      })
    );

    patientsWithCount.sort((a, b) => b.appointmentCount - a.appointmentCount);

    res.status(200).json({
      success: true,
      count: patientsWithCount.length,
      data: patientsWithCount,
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    });
  }
};

export const getPatientHistoryController = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await APPOINTMENT.find({
      doctorId: req.doctor._id,
      userId: patientId,
    })
      .populate("userId", "name email phone profilePicture dateOfBirth bloodGroup")
      .populate("clinicId", "clinicName address city")
      .populate("slotId")
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get patient history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient history",
      error: error.message,
    });
  }
};

export const getPatientDetailsController = async (req, res) => {
  try {
    const { patientId } = req.params;

    const hasConsulted = await APPOINTMENT.findOne({
      doctorId: req.doctor._id,
      userId: patientId,
    });

    if (!hasConsulted) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this patient's information",
      });
    }

    const patient = await USER.findById(patientId).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const appointmentCount = await APPOINTMENT.countDocuments({
      doctorId: req.doctor._id,
      userId: patientId,
    });

    const lastConsultation = await APPOINTMENT.findOne({
      doctorId: req.doctor._id,
      userId: patientId,
    })
      .sort({ appointmentDate: -1 })
      .populate("clinicId", "clinicName");

    res.status(200).json({
      success: true,
      data: {
        ...patient.toObject(),
        appointmentCount,
        lastConsultation,
      },
    });
  } catch (error) {
    console.error("Get patient details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient details",
      error: error.message,
    });
  }
};