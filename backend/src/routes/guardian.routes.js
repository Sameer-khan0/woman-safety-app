import { Router } from "express";
import { verifyJwtGuardian } from "../middlewares/guardian.middleware.js";
import {
  registerGuardian,
  loginGuardian,
  getAllGuardian,
  updateGardianProfile,
  getAllGuardianWomen,
} from "../controllers/guardian.controller.js";

const router = Router();

router.route("/register-guardian").post(registerGuardian);
router.route("/login-guardian").post(loginGuardian);
router.route("/get-all-guardian").get(getAllGuardian);
router.route("/guardian-women").get(verifyJwtGuardian, getAllGuardianWomen);
router
  .route("/update-guardian-profile")
  .patch(verifyJwtGuardian, updateGardianProfile);

export default router;
