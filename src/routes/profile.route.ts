import { Router } from "express";
import { validate } from "../middlewares/validate";
import { updateProfileSchema, changePasswordSchema } from "../validations/profile.validation";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { uploadImage } from "../middlewares/global/uploadImage.middleware";
import { getProfileController, updateProfileController, updateProfileImageController, changePasswordController, } from "../controllers/profile.controller";

const router = Router();

router.get("/me", authValidation, getProfileController);
router.put("/me", authValidation, validate(updateProfileSchema), updateProfileController);
router.put("/me/image", authValidation, uploadImage.single("image"), updateProfileImageController);
router.put("/me/password", authValidation, validate(changePasswordSchema), changePasswordController);

export default router;