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
    authValidation,
    requireAdmin,
    validate(createCategorySchema),
    createCategoryController
);

router.put(
    "/:id",
    authValidation,
    requireAdmin,
    validate(updateCategorySchema),
    updateCategoryController
);

router.delete(
    "/:id",
    authValidation,
    requireAdmin,
    deleteCategoryController
);

export default router;