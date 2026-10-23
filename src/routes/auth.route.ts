import { Router } from "express";
import { validate } from "../middlewares/global/validate";
import { signupSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, } from "../validations/auth.validation";
import { signupController, loginController, forgetPasswordController, resetPasswordController, googleLoginController, verifyEmailController, logoutController, } from "../controllers/auth.controller";
import { rejectIfUserExistsByEmail } from "../middlewares/auth/rejectIfUserExistsByEmail.middleware";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { requireUserExistsByEmail } from "../middlewares/auth/requireUserExistsByEmail.middleware";

const router = Router();

router.post("/signup", validate(signupSchema), rejectIfUserExistsByEmail, signupController);
router.post("/login", validate(loginSchema), requireUserExistsByEmail, loginController);
router.post("/forget-password", validate(forgetPasswordSchema), requireUserExistsByEmail, forgetPasswordController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);
router.post("/google", googleLoginController);
router.get("/verify-email", verifyEmailController);
router.post("/logout", authValidation, logoutController);

export default router;