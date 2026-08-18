import { prisma } from "../../config/db";
import { BadRequestError } from "../../utils/errors";

export const getCategoryById = async (categoryId: number) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new BadRequestError("Invalid category");
    }

    return category;
};