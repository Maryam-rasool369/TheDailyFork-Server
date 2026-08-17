import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createBlogSchema, updateBlogSchema } from "../validations/blog.validation";
import { requireAuth } from "../middlewares/global/authValidation.middleware";
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
    requireAuth,
    uploadImage.single("image"),
    requireFile,
    validate(createBlogSchema),
    createBlogController
);

router.get("/mine", requireAuth, getMyBlogsController);

router.put(
    "/:id",
    requireAuth,
    requireBlogOwnership,
    uploadImage.single("image"),
    validate(updateBlogSchema),
    updateBlogController
);

router.delete("/:id", requireAuth, requireBlogOwnership, deleteBlogController);

// Admin only
router.get("/admin/all", requireAuth, requireAdmin, getAllBlogsForAdminController);
router.patch("/admin/:id/approve", requireAuth, requireAdmin, approveBlogController);
router.patch("/admin/:id/reject", requireAuth, requireAdmin, rejectBlogController);

export default router;