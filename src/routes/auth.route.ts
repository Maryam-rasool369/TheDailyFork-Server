import { Router } from "express"
import { forgetPasswordController, loginController, resetPasswordController, signupController } from "../controllers/auth.controller";
const authRouter = Router()

authRouter.post("/signup",signupController);
authRouter.post("/login",loginController);
authRouter.post("/forget-password", forgetPasswordController);
authRouter.post("/reset-password", resetPasswordController);

export default authRouter;

