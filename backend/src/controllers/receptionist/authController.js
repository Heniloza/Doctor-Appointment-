import RECEPTIONIST from "../../models/receptionistModel.js";
import DOCTOR from "../../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createReceptionistController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const doctorId = req.doctor._id;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingReceptionist = await RECEPTIONIST.findOne({ doctorId });
    if (existingReceptionist) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a receptionist. Each doctor can have only one receptionist.",
      });
    }

    const emailExists = await RECEPTIONIST.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const receptionist = await RECEPTIONIST.create({
      name,
      email,
      password: hashedPassword,
      phone,
      doctorId,
      createdBy: doctorId,
    });

    const receptionistData = await RECEPTIONIST.findById(receptionist._id)
      .select("-password")
      .populate("doctorId", "name email specialization");

    res.status(201).json({
      success: true,
      message: "Receptionist created successfully",
      data: receptionistData,
    });
  } catch (error) {
    console.error("Create receptionist error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating receptionist",
      error: error.message,
    });
  }
};

export const receptionistLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const receptionist = await RECEPTIONIST.findOne({ email }).populate(
      "doctorId",
      "name email specialization clinicId",
    );

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!receptionist.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact the doctor.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      receptionist.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ _id: receptionist._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const receptionistData = receptionist.toObject();
    delete receptionistData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: receptionistData,
    });
  } catch (error) {
    console.error("Receptionist login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

export const receptionistLogoutController = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Receptionist logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const receptionist = await RECEPTIONIST.findById(req.receptionist._id)
      .select("-password")
      .populate("doctorId", "name email specialization clinicId");

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: receptionist,
    });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking authentication",
    });
  }
};

export const getReceptionistProfileController = async (req, res) => {
  try {
    const receptionist = await RECEPTIONIST.findById(req.receptionist._id)
      .select("-password")
      .populate("doctorId", "name email specialization clinicId");

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: receptionist,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

export const updateReceptionistProfileController = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const receptionist = await RECEPTIONIST.findByIdAndUpdate(
      req.receptionist._id,
      { name, phone },
      { new: true, runValidators: true },
    )
      .select("-password")
      .populate("doctorId", "name email specialization");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: receptionist,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

export const getDoctorReceptionistController = async (req, res) => {
  try {
    const receptionist = await RECEPTIONIST.findOne({
      doctorId: req.doctor._id,
    })
      .select("-password")
      .populate("doctorId", "name email specialization");

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "No receptionist found",
      });
    }

    res.status(200).json({
      success: true,
      data: receptionist,
    });
  } catch (error) {
    console.error("Get receptionist error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching receptionist",
    });
  }
};

export const deleteReceptionistController = async (req, res) => {
  try {
    const receptionist = await RECEPTIONIST.findOneAndDelete({
      doctorId: req.doctor._id,
    });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Receptionist deleted successfully",
    });
  } catch (error) {
    console.error("Delete receptionist error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting receptionist",
    });
  }
};

export const toggleReceptionistStatusController = async (req, res) => {
  try {
    const receptionist = await RECEPTIONIST.findOne({
      doctorId: req.doctor._id,
    });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found",
      });
    }

    receptionist.isActive = !receptionist.isActive;
    await receptionist.save();

    res.status(200).json({
      success: true,
      message: `Receptionist ${receptionist.isActive ? "activated" : "deactivated"} successfully`,
      data: { isActive: receptionist.isActive },
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling status",
    });
  }
};
