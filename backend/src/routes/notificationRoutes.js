import express from "express";
import {
  getUserNotifications,
  getDoctorNotifications,
  getClinicNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";
import { doctorAuthMiddleware } from "../middleware/doctorMiddleware.js";
import { clinicAuthMiddleware } from "../middleware/clinicAuthMiddleware.js";

const router = express.Router();

router.get("/user", authMiddleware, getUserNotifications);
router.get("/user/unread-count", authMiddleware, getUnreadCount);
router.put("/user/mark-all-read",authMiddleware,markAllNotificationsAsRead);

router.delete("/user/clear-read",authMiddleware,deleteAllReadNotifications);
router.get("/doctor", doctorAuthMiddleware, getDoctorNotifications);
router.get("/doctor/unread-count", doctorAuthMiddleware, getUnreadCount);
router.put("/doctor/mark-all-read",doctorAuthMiddleware,markAllNotificationsAsRead,);
router.delete( "/doctor/clear-read",doctorAuthMiddleware,deleteAllReadNotifications,);
router.get("/clinic", clinicAuthMiddleware, getClinicNotifications);
router.get("/clinic/unread-count", clinicAuthMiddleware, getUnreadCount);
router.put("/clinic/mark-all-read",clinicAuthMiddleware,markAllNotificationsAsRead,);
router.delete("/clinic/clear-read",clinicAuthMiddleware,deleteAllReadNotifications);
router.put("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

export default router;
