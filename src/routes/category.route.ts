import { Router } from "express";

import { validate } from "../middlewares/validate";
import { authValidation } from "../middlewares/global/authValidation.middleware";
import { requireAdmin } from "../middlewares/auth/requireAdmin.middleware";

import {
    createCategorySchema,
    updateCategorySchema,
} from "../validations/category.validation";

import {
    createCategoryController,
    deleteCategoryController,
    getCategoriesController,
    updateCategoryController,
} from "../controllers/category.controller";

const router = Router();

/*
 * Public
 *
 * Frontend needs this when creating a blog.
 */
router.get("/", getCategoriesController);

/*
 * Admin only
 */
router.post(
    "/",
    validate(createCategorySchema),
    authValidation,
    requireAdmin,
    createCategoryController
);

router.put(
    "/:id",
    validate(updateCategorySchema),
    authValidation,
    requireAdmin,
    updateCategoryController
);

router.delete(
    "/:id",
    authValidation,
    requireAdmin,
    deleteCategoryController
);

export default router;