import { Router } from "express";
import { verifyJwtCombined } from "../middlewares/combine.middleware.js";
import { verifyJwtWomen } from "../middlewares/women.middleware.js";
import { verifyJwtGuardian } from "../middlewares/guardian.middleware.js";
import {
    addAlert,
    checkAlertStatus,
    removeAlert
} from "../controllers/alert.controller.js";

const router = Router();

router.route('/add-alert').post(verifyJwtWomen, addAlert);
router.route('/check-alert').get(verifyJwtCombined, checkAlertStatus);
router.route('/delete-alert').delete(verifyJwtCombined, removeAlert);

export default router;
