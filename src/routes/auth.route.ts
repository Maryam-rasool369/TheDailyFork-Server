import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
    signupSchema,
    loginSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
} from "../validations/auth.validation";
import {
    signupController,
    loginController,
    forgetPasswordController,
    resetPasswordController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.post("/forget-password", validate(forgetPasswordSchema), forgetPasswordController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);

export default router;