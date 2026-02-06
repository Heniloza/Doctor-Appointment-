import USER from "../models/userModel.js";
import DOCTOR from "../models/doctorModel.js";
import CLINIC from "../models/clinicModel.js";

export const saveUserFCMToken = async (req, res) => {
  try {
    const { token, device = "web" } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const user = await USER.findByIdAndUpdate(
      req.user._id,
      { fcmToken: token },
      { new: true },
    ).select("-password");

    console.log(`FCM token saved for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "FCM token saved successfully",
      data: {
        userId: user._id,
        device,
      },
    });
  } catch (error) {
    console.error("Save user FCM token error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving FCM token",
      error: error.message,
    });
  }
};

export const removeUserFCMToken = async (req, res) => {
  try {
    const user = await USER.findByIdAndUpdate(
      req.user._id,
      { $unset: { fcmToken: 1 } },
      { new: true },
    ).select("-password");

    console.log(`FCM token removed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "FCM token removed successfully",
    });
  } catch (error) {
    console.error("Remove user FCM token error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing FCM token",
      error: error.message,
    });
  }
};

export const saveDoctorFCMToken = async (req, res) => {
  try {
    const { token, device = "web" } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const doctor = await DOCTOR.findByIdAndUpdate(
      req.doctor._id,
      { fcmToken: token },
      { new: true },
    ).select("-password");

    console.log(`FCM token saved for doctor: ${doctor.email}`);

    res.status(200).json({
      success: true,
      message: "FCM token saved successfully",
      data: {
        doctorId: doctor._id,
        device,
      },
    });
  } catch (error) {
    console.error("Save doctor FCM token error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving FCM token",
      error: error.message,
    });
  }
};

export const removeDoctorFCMToken = async (req, res) => {
  try {
    const doctor = await DOCTOR.findByIdAndUpdate(
      req.doctor._id,
      { $unset: { fcmToken: 1 } },
      { new: true },
    ).select("-password");

    console.log(`FCM token removed for doctor: ${doctor.email}`);

    res.status(200).json({
      success: true,
      message: "FCM token removed successfully",
    });
  } catch (error) {
    console.error("Remove doctor FCM token error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing FCM token",
      error: error.message,
    });
  }
};

export const saveClinicFCMToken = async (req, res) => {
  try {
    const { token, device = "web" } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const clinic = await CLINIC.findByIdAndUpdate(
      req.clinic._id,
      { fcmToken: token },
      { new: true },
    ).select("-password");

    console.log(`FCM token saved for clinic: ${clinic.email}`);

    res.status(200).json({
      success: true,
      message: "FCM token saved successfully",
      data: {
        clinicId: clinic._id,
        device,
      },
    });
  } catch (error) {
    console.error("Save clinic FCM token error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving FCM token",
      error: error.message,
    });
  }
};

export const removeClinicFCMToken = async (req, res) => {
  try {
    const clinic = await CLINIC.findByIdAndUpdate(
      req.clinic._id,
      { $unset: { fcmToken: 1 } },
      { new: true },
    ).select("-password");

    console.log(`FCM token removed for clinic: ${clinic.email}`);

    res.status(200).json({
      success: true,
      message: "FCM token removed successfully",
    });
  } catch (error) {
    console.error("Remove clinic FCM token error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing FCM token",
      error: error.message,
    });
  }
};

