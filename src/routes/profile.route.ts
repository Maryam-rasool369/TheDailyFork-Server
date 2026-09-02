import { Router } from "express";
import { validate } from "../middlewares/validate";
import { updateProfileSchema, changePasswordSchema } from "../validations/profile.validation";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { uploadImage } from "../middlewares/global/uploadImage.middleware";
import { getProfileController, updateProfileController, changePasswordController, } from "../controllers/profile.controller";

const router = Router();

router.get("/me", authValidation, getProfileController);

// Single "Edit Profile" page — image is optional, only re-uploaded if sent
router.put(
    "/me",
    uploadImage.single("image"),
    validate(updateProfileSchema),
    authValidation,
    updateProfileController
);
router.put("/me/password",
    validate(changePasswordSchema),
    authValidation,
    changePasswordController);

export default router;