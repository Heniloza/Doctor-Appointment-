import jwt from "jsonwebtoken";
import RECEPTIONIST from "../models/receptionistModel.js";

export const receptionistAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const receptionist = await RECEPTIONIST.findById(decoded._id).populate(
      "doctorId",
      "name email specialization clinicId",
    );

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found",
      });
    }

    if (!receptionist.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    req.receptionist = receptionist;
    next();
  } catch (error) {
    console.error("Receptionist auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};
