import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createBlogSchema, updateBlogSchema } from "../validations/blog.validation";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { requireAdmin } from "../middlewares/auth/requireAdmin.middleware";
import { requireBlogOwnership } from "../middlewares/blog/requireBlogOwnership.middleware";
import { uploadImage } from "../middlewares/global/uploadImage.middleware";
import { createBlogController, updateBlogController, deleteBlogController, getMyBlogsController, getApprovedBlogsController, getAllBlogsForAdminController, approveBlogController, rejectBlogController, } from "../controllers/blog.controller";
import { requireFile } from "../middlewares/global/requireFile.middleware";

const router = Router();

// Public all approved blogs
router.get("/", getApprovedBlogsController);

// Logged-in user
router.post(
    "/",
    authValidation,
    uploadImage.single("image"),
    requireFile,
    validate(createBlogSchema),
    createBlogController
);

router.get("/mine", authValidation, getMyBlogsController);

router.put(
    "/:id",
    authValidation,
    requireBlogOwnership,
    uploadImage.single("image"),
    validate(updateBlogSchema),
    updateBlogController
);

router.delete("/:id", authValidation, requireBlogOwnership, deleteBlogController);

// Admin only
router.get("/admin/all", authValidation, requireAdmin, getAllBlogsForAdminController);
router.patch("/admin/:id/approve", authValidation, requireAdmin, approveBlogController);
router.patch("/admin/:id/reject", authValidation, requireAdmin, rejectBlogController);

export default router;