import { Router } from "express";
import { validate } from "../middlewares/validate";
import { updateProfileSchema, changePasswordSchema } from "../validations/profile.validation";
import { requireAuth } from "../middlewares/global/authValidation.middleware";
import { uploadImage } from "../middlewares/global/uploadImage.middleware";
import { getProfileController, updateProfileController, updateProfileImageController, changePasswordController, } from "../controllers/profile.controller";

const router = Router();

router.get("/me", requireAuth, getProfileController);
router.put("/me", requireAuth, validate(updateProfileSchema), updateProfileController);
router.put("/me/image", requireAuth, uploadImage.single("image"), updateProfileImageController);
router.put("/me/password", requireAuth, validate(changePasswordSchema), changePasswordController);

export default router;