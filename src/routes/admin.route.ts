import { Router } from "express";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { requireAdmin } from "../middlewares/auth/requireAdmin.middleware";
import {
    getAdminStatsController,
    getAdminUsersController,
    getAdminSubscriptionsController,
    adminLoginController,
    setAdminFeaturedBlogsController,
} from "../controllers/admin.controller";
import { requireUserExistsByEmail } from "../middlewares/auth/requireUserExistsByEmail.middleware";
import { loginSchema } from "../validations/auth.validation";
import { validate } from "../middlewares/global/validate";
import { approveBlogControllerForAdmin, getAllBlogsForAdminController, rejectBlogControllerForAdmin } from "../controllers/admin.controller";
import { setFeaturedBlogsSchema } from "../validations/blog.validation";

const router = Router();

router.post("/login",
    validate(loginSchema),
    requireUserExistsByEmail,
    adminLoginController
);
router.get("/stats", authValidation, requireAdmin, getAdminStatsController);
router.get("/users", authValidation, requireAdmin, getAdminUsersController);
router.get("/subscriptions", authValidation, requireAdmin, getAdminSubscriptionsController);

// Blogs related routes for admin
router.get("/all", authValidation, requireAdmin, getAllBlogsForAdminController);
router.patch("/:id/approve", authValidation, requireAdmin, approveBlogControllerForAdmin);
router.patch("/:id/reject", authValidation, requireAdmin, rejectBlogControllerForAdmin);
router.patch(
    "/featured",
    authValidation,
    requireAdmin,
    validate(setFeaturedBlogsSchema),
     setAdminFeaturedBlogsController

);  
export default router;          
