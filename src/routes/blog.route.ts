import { Router } from "express";
import { validate, validateQuery } from "../middlewares/global/validate";
import { createBlogSchema, getBlogsQuerySchema, getMyBlogsQuerySchema, updateBlogSchema } from "../validations/blog.validation";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { requireBlogOwnership } from "../middlewares/blog/requireBlogOwnership.middleware";
import { uploadImage } from "../middlewares/global/uploadImage.middleware";
import { createBlogController, updateBlogController, deleteBlogController, getMyBlogsController, getApprovedBlogsController, getBlogByIdController, getBlogForEditController, getPopularBlogsController, unlikeBlogController, likeBlogController, } from "../controllers/blog.controller";
import { requireFile } from "../middlewares/global/requireFile.middleware";
import { requireActiveSubscription } from "../middlewares/subscription/requireActiveSubscription.middleware";
import { optionalAuthValidation } from "../middlewares/global/optionalAuth.middleware";
import { getFeaturedBlogsController } from "../controllers/admin.controller";
import { validateIdParam } from "../middlewares/global/validateIdParam.middleware";

const router = Router();

// Public all approved blogs
router.get("/", validateQuery(getBlogsQuerySchema), optionalAuthValidation, getApprovedBlogsController);


//All user blogs approved or pending
//should we add the subscription middleware here? 
router.get("/mine", authValidation, validateQuery(getMyBlogsQuerySchema), getMyBlogsController);
router.get("/featured", optionalAuthValidation, getFeaturedBlogsController);
router.get("/popular", optionalAuthValidation, getPopularBlogsController);
router.post(
    "/:id/like",
    validateIdParam,
    authValidation,
    likeBlogController
);

router.delete(
    "/:id/like",
    validateIdParam,
    authValidation,
    unlikeBlogController
);
router.get(
    "/:id/edit",
    validateIdParam,
    authValidation,
    requireBlogOwnership,
    getBlogForEditController
);

// router.get("/:id", authValidation, getBlogByIdController);
router.get("/:id", validateIdParam, optionalAuthValidation, getBlogByIdController);

// Create only by Logged-in user
router.post(
    "/",
    uploadImage.single("image"),
    authValidation,
    requireActiveSubscription,
    requireFile,
    validate(createBlogSchema),
    createBlogController
);

router.put(
    "/:id",
    validateIdParam,
    uploadImage.single("image"),
    authValidation,
    requireBlogOwnership,
    requireActiveSubscription,
    validate(updateBlogSchema),
    updateBlogController
);

router.delete("/:id",
    validateIdParam,
    authValidation,
    requireBlogOwnership,
    requireActiveSubscription,
    deleteBlogController
);





export default router;