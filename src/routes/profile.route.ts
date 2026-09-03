import { Router } from "express";
import { validate } from "../middlewares/validate";
import { updateProfileSchema, changePasswordSchema, verifyPasswordSchema } from "../validations/profile.validation";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { uploadImage } from "../middlewares/global/uploadImage.middleware";
import {
    getProfileController,
    updateProfileController,
    verifyPasswordController,
    changePasswordController,
} from "../controllers/profile.controller";

const router = Router();

router.get("/me", authValidation, getProfileController);

router.put(
    "/me",
    uploadImage.single("image"),
    authValidation,
    validate(updateProfileSchema),
    updateProfileController
);

router.post(
    "/me/verify-password",
    authValidation,
    validate(verifyPasswordSchema),
    verifyPasswordController
);

router.put(
    "/me/password",
    authValidation,
    validate(changePasswordSchema),
    changePasswordController
);

export default router;