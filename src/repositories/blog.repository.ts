import { prisma } from "../config/db";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { BlogStatus } from "../comman/enum";

export const findApprovedBlogs = async () => {
    return prisma.blog.findMany({
        where: { status: BlogStatus.APPROVED },
        include: {
            category: true,
            author: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const findBlogsByAuthor = async (authorId: number) => {
    return prisma.blog.findMany({
        where: { authorId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
};

export const findAllBlogsForAdmin = async () => {
    return prisma.blog.findMany({
        include: {
            category: true,
            author: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const findBlogById = async (blogId: number) => {
    return prisma.blog.findUnique({ where: { id: blogId } });
};

export const insertBlog = async (
    data: CreateBlogInput,
    authorId: number,
    imageUrl: string
) => {
    return prisma.blog.create({
        data: {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            categoryId: data.categoryId,
            imageUrl,
            authorId,
            status: BlogStatus.PENDING,
        },
    });
};

export const updateBlogById = async (
    blogId: number,
    data: UpdateBlogInput,
    imageUrl?: string
) => {
    return prisma.blog.update({
        where: { id: blogId },
        data: {
            ...data,
            ...(imageUrl && { imageUrl }),
        },
    });
};

export const deleteBlogById = async (blogId: number) => {
    return prisma.blog.delete({ where: { id: blogId } });
};

export const updateBlogStatus = async (blogId: number, status: BlogStatus) => {
    return prisma.blog.update({
        where: { id: blogId },
        data: { status },
    });
};