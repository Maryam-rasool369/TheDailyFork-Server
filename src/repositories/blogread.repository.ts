import { prisma } from "../config/db";

export const findBlogRead = async (userId: number, blogId: number) => {
    return prisma.blogRead.findUnique({
        where: { userId_blogId: { userId, blogId } }, //composite unique key userId_blogId
    });
};

export const createBlogRead = async (userId: number, blogId: number) => {
    return prisma.blogRead.create({
        data: { userId, blogId },
    });
};

export const countBlogReads = async (userId: number) => {
    return prisma.blogRead.count({
        where: { userId },
    });
};