import { prisma } from "../config/db";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { NotFoundError, BadRequestError } from "../utils/errors";

export const createBlog = async (
    data: CreateBlogInput,
    authorId: number,
    imageUrl: string
) => {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
        throw new BadRequestError("Invalid category");
    }

    const blog = await prisma.blog.create({
        data: {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            categoryId: data.categoryId,
            imageUrl,
            authorId,
            status: "PENDING",
        },
    });

    return blog;
};

export const updateBlog = async (blogId: number, data: UpdateBlogInput, imageUrl?: string) => {
    const blog = await prisma.blog.update({
        where: { id: blogId },
        data: {
            ...data,
            ...(imageUrl && { imageUrl }),
        },
    });

    return blog;
};

export const deleteBlog = async (blogId: number) => {
    await prisma.blog.delete({ where: { id: blogId } });
    return;
};

// User's own blogs — both approved and pending
export const getMyBlogs = async (authorId: number) => {
    return prisma.blog.findMany({
        where: { authorId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
};

// Public feed — approved only
export const getApprovedBlogs = async () => {
    return prisma.blog.findMany({
        where: { status: "APPROVED" },
        include: { category: true, author: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
    });
};

// Admin — sees everything, any status
export const getAllBlogsForAdmin = async () => {
    return prisma.blog.findMany({
        include: { category: true, author: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: "desc" },
    });
};

export const approveBlog = async (blogId: number) => {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundError("Blog not found");

    return prisma.blog.update({
        where: { id: blogId },
        data: { status: "APPROVED" },
    });
};

export const rejectBlog = async (blogId: number) => {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundError("Blog not found");

    return prisma.blog.update({
        where: { id: blogId },
        data: { status: "REJECTED" },
    });
};