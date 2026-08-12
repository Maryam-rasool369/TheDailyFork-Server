import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createBlogSchema, updateBlogSchema } from "../validations/blog.validation";
import { requireAuth } from "../middlewares/auth/requireAuth.middleware";
import { requireAdmin } from "../middlewares/auth/requireAdmin.middleware";
import { requireBlogOwnership } from "../middlewares/blog/requireBlogOwnership.middleware";
import { upload } from "../middlewares/upload.middleware";
import { createBlogController, updateBlogController, deleteBlogController, getMyBlogsController, getApprovedBlogsController, getAllBlogsForAdminController, approveBlogController, rejectBlogController, } from "../controllers/blog.controller";

const router = Router();

// Public all approved blogs
router.get("/", getApprovedBlogsController);

// Logged-in user
router.post(
    "/",
    requireAuth,
    upload.single("image"),
    validate(createBlogSchema),
    createBlogController
);

router.get("/mine", requireAuth, getMyBlogsController);

router.put(
    "/:id",
    requireAuth,
    requireBlogOwnership,
    upload.single("image"),
    validate(updateBlogSchema),
    updateBlogController
);

router.delete("/:id", requireAuth, requireBlogOwnership, deleteBlogController);

// Admin only
router.get("/admin/all", requireAuth, requireAdmin, getAllBlogsForAdminController);
router.patch("/admin/:id/approve", requireAuth, requireAdmin, approveBlogController);
router.patch("/admin/:id/reject", requireAuth, requireAdmin, rejectBlogController);

export default router;