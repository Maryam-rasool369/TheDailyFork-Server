import { prisma } from "../config/db";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { BlogStatus } from "../comman/enum";

export const findApprovedBlogs = async () => {
    return prisma.blog.findMany({
        where: { status: BlogStatus.APPROVED },
        include: {
            category: { select: { id: true, name: true } },
            author: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const findBlogsByAuthor = async (authorId: number) => {
    return prisma.blog.findMany({
        where: { authorId },
        include: {
            category: { select: { id: true, name: true } },
            author: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const findAllBlogsForAdmin = async () => {
    return prisma.blog.findMany({
        include: {
            category: true,
            author: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const findBlogById = async (blogId: number) => {
    return prisma.blog.findUnique({
        where: { id: blogId },
        include: {
            category: { select: { id: true, name: true } },
            author: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        },
    });
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
            ...(data.title !== undefined && {
                title: data.title,
            }),

            ...(data.shortDescription !== undefined && {
                shortDescription: data.shortDescription,
            }),

            ...(data.content !== undefined && {
                content: data.content,
            }),

            ...(data.categoryId !== undefined && {
                category: {
                    connect: {
                        id: data.categoryId,
                    },
                },
            }),

            ...(imageUrl !== undefined && {
                imageUrl,
            }),
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