import express from "express";
import {
  saveUserFCMToken,
  removeUserFCMToken,
  saveDoctorFCMToken,
  removeDoctorFCMToken,
  saveClinicFCMToken,
  removeClinicFCMToken,
} from "../controllers/tokenController.js";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";
import { doctorAuthMiddleware } from "../middleware/doctorMiddleware.js";
import { clinicAuthMiddleware } from "../middleware/clinicAuthMiddleware.js";

const router = express.Router();

router.post("/user/save", authMiddleware, saveUserFCMToken);
router.post("/user/remove", authMiddleware, removeUserFCMToken);
router.post("/doctor/save", doctorAuthMiddleware, saveDoctorFCMToken);
router.post("/doctor/remove", doctorAuthMiddleware, removeDoctorFCMToken);
router.post("/clinic/save", clinicAuthMiddleware, saveClinicFCMToken);
router.post("/clinic/remove", clinicAuthMiddleware, removeClinicFCMToken);

export default router;
