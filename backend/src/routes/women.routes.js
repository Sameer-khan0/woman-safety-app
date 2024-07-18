import { Router } from "express";
import {
  registerWomen,
  loginWomen,
  updateWomenProfile,
  GetWomanGuardian,
  AddGuardian,
} from "../controllers/women.controller.js";
import { verifyJwtWomen } from "../middlewares/women.middleware.js";

const router = Router();

router.route("/register-women").post(registerWomen);
router.route("/login-women").post(loginWomen);
router.route("/update-profile").patch(verifyJwtWomen, updateWomenProfile);
router.route("/woman-guardian").get(verifyJwtWomen, GetWomanGuardian);
router.route("/add-guardian").post(verifyJwtWomen, AddGuardian);

export default router;
