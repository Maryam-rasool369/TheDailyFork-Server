import { Request, Response, NextFunction } from "express";

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../services/category.service";

import {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../validations/category.validation";

export const getCategoriesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await getCategories();

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

export const createCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: CreateCategoryInput = req.body;

        const category = await createCategory(data);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = Number(req.params.id);
        const data: UpdateCategoryInput = req.body;

        const category = await updateCategory(categoryId, data);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = Number(req.params.id);

        await deleteCategory(categoryId);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};