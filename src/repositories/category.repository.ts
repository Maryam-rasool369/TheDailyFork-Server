import { prisma } from "../config/db";
import {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../validations/category.validation";

export const findAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
};

export const findCategoryById = async (categoryId: number) => {
    return prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
};

export const findCategoryByName = async (name: string) => {
    return prisma.category.findUnique({
        where: {
            name,
        },
    });
};

export const insertCategory = async (data: CreateCategoryInput) => {
    return prisma.category.create({
        data: {
            name: data.name,
        },
    });
};

export const updateCategoryById = async (
    categoryId: number,
    data: UpdateCategoryInput
) => {
    return prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            name: data.name,
        },
    });
};

export const deleteCategoryById = async (categoryId: number) => {
    return prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
};

export const countBlogsByCategory = async (categoryId: number) => {
    return prisma.blog.count({
        where: {
            categoryId,
        },
    });
};