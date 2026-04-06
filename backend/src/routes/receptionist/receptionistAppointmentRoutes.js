import { Router } from "express";
import {
  getReceptionistAppointmentsController,
  getTodayAppointmentsController,
  getAppointmentStatsController,
  searchPatientsController,
  getAppointmentByIdController,
  updateAppointmentStatusController,
} from "../../controllers/receptionist/receptionistAppointmentController.js";
import { receptionistAuthMiddleware } from "../../middleware/receptionistAuthMiddleware.js";

const router = Router();

router.get("/all", receptionistAuthMiddleware, getReceptionistAppointmentsController);
router.get("/today", receptionistAuthMiddleware, getTodayAppointmentsController);
router.get("/stats", receptionistAuthMiddleware, getAppointmentStatsController);
router.get("/search-patients", receptionistAuthMiddleware, searchPatientsController);
router.get("/:appointmentId", receptionistAuthMiddleware, getAppointmentByIdController);
router.put(
  "/:appointmentId/status",
  receptionistAuthMiddleware,
  updateAppointmentStatusController,
);

export default router;
