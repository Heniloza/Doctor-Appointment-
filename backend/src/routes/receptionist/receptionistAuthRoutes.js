import { Router } from "express";
import {
  receptionistLoginController,
  receptionistLogoutController,
  checkAuth,
  getReceptionistProfileController,
  updateReceptionistProfileController,
} from "../../controllers/receptionist/authController.js";
import { receptionistAuthMiddleware } from "../../middleware/receptionistAuthMiddleware.js";

const router = Router();

router.post("/login", receptionistLoginController);
router.post("/logout", receptionistLogoutController);
router.get("/check-auth", receptionistAuthMiddleware, checkAuth);
router.get("/profile", receptionistAuthMiddleware, getReceptionistProfileController);
router.put("/profile", receptionistAuthMiddleware, updateReceptionistProfileController);

export default router;
