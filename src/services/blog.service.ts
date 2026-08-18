import { prisma } from "../config/db";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { BlogStatus } from "../comman/enum";

// Public feed — approved only
export const getApprovedBlogs = async () => {
    return prisma.blog.findMany({
        where: { status: "APPROVED" },
        include: {
            category: true,
            author: { select: { id: true, firstName: true, lastName: true } } //true here is not boolean but for the column that we need 
        },
        orderBy: { createdAt: "desc" },
    });
};

export const createBlog = async (
    data: CreateBlogInput,
    authorId: number,
    imageUrl: string
) => {

    const blog = await prisma.blog.create({
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



// Admin — sees everything, any status
export const getAllBlogsForAdmin = async () => {
    return prisma.blog.findMany({
        include: { category: true, author: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: "desc" },
    });
};

export const getBlogById = async (blogId: number) => {
    const blog = await prisma.blog.findUnique({
        where: { id: blogId },
    });

    if (!blog) {
        throw new NotFoundError("Blog not found");
    }

    return blog;
};
export const approveBlog = async (blogId: number) => {
    return prisma.blog.update({
        where: { id: blogId },
        data: {
            status: BlogStatus.APPROVED,
        },
    });
};

export const rejectBlog = async (blogId: number) => {
    return prisma.blog.update({
        where: { id: blogId },
        data: { status: "REJECTED" },
    });
};