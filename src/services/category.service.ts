import {
    countBlogsByCategory,
    deleteCategoryById,
    findAllCategories,
    findCategoryById,
    findCategoryByName,
    insertCategory,
    updateCategoryById,
} from "../repositories/category.repository";

import {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../validations/category.validation";

import { ConflictError, NotFoundError } from "../utils/errors";

export const getCategories = async () => {
    return findAllCategories();
};

export const getCategoryById = async (categoryId: number) => {
    const category = await findCategoryById(categoryId);

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    return category;
};

export const createCategory = async (data: CreateCategoryInput) => {
    const existingCategory = await findCategoryByName(data.name);

    if (existingCategory) {
        throw new ConflictError("Category already exists");
    }

    return insertCategory(data);
};

export const updateCategory = async (
    categoryId: number,
    data: UpdateCategoryInput
) => {
    await getCategoryById(categoryId);

    const existingCategory = await findCategoryByName(data.name);

    if (existingCategory && existingCategory.id !== categoryId) {
        throw new ConflictError("Category already exists");
    }

    return updateCategoryById(categoryId, data);
};

export const deleteCategory = async (categoryId: number) => {
    await getCategoryById(categoryId);

    const blogCount = await countBlogsByCategory(categoryId);

    if (blogCount > 0) {
        throw new ConflictError(
            "Cannot delete a category that is being used by blogs"
        );
    }

    return deleteCategoryById(categoryId);
};