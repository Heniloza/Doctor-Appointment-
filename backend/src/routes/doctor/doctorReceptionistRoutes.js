import { Router } from "express";
import {
  createReceptionistController,
  getDoctorReceptionistController,
  deleteReceptionistController,
  toggleReceptionistStatusController,
} from "../../controllers/receptionist/authController.js";
import { doctorAuthMiddleware } from "../../middleware/doctorMiddleware.js";

const router = Router();

router.post("/create", doctorAuthMiddleware, createReceptionistController);
router.get("/my-receptionist", doctorAuthMiddleware, getDoctorReceptionistController);
router.delete("/delete", doctorAuthMiddleware, deleteReceptionistController);
router.put("/toggle-status", doctorAuthMiddleware, toggleReceptionistStatusController);

export default router;
