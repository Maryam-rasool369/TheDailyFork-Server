import {
    deleteBlogById, findApprovedBlogs, findBlogById, findBlogsByAuthor, findPopularBlogs, insertBlog, updateBlogById, updateBlogStatus, createBlogLike,
    deleteBlogLike,
    findBlogLike,
} from "../repositories/blog.repository";
import { CreateBlogInput, UpdateBlogInput, GetBlogsQuery, GetMyBlogsQuery } from "../validations/blog.validation";
import { getCategoryById } from "./category.service";
import {
    BadRequestError,
    NotFoundError,
} from "../utils/errors";

import { BlogStatus } from "../comman/enum";


const buildPagination = (page: number, limit: number, total: number) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});

export const getApprovedBlogs = async (query: GetBlogsQuery) => {
    const { blogs, total } = await findApprovedBlogs(query);

    return {
        blogs,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        },
    };
};

export const getMyBlogs = async (authorId: number, query: GetMyBlogsQuery) => {
    const { blogs, total } = await findBlogsByAuthor(authorId, query);

    return {
        blogs,
        pagination: buildPagination(query.page, query.limit, total),
    };
};

export const getBlogById = async (blogId: number) => {
    const blog = await findBlogById(blogId);

    if (!blog) {
        throw new NotFoundError("Blog not found");
    }

    return blog;
};

export const createBlog = async (
    data: CreateBlogInput,
    authorId: number,
    imageUrl: string
) => {
    // Business rule: category must exist before a blog can reference it
    await getCategoryById(data.categoryId);

    return insertBlog(data, authorId, imageUrl);
};

export const updateBlog = async (
    blogId: number,
    data: UpdateBlogInput,
    imageUrl?: string
) => {
    // Ensure the blog actually exists before attempting an update
    await getBlogById(blogId);

    if (data.categoryId !== undefined) {
        await getCategoryById(data.categoryId);
    }

    return updateBlogById(blogId, data, imageUrl);
};

export const deleteBlog = async (blogId: number) => {
    await getBlogById(blogId); // ensures a clear 404 instead of a raw Prisma "record not found" error
    return deleteBlogById(blogId);
};


export const getPopularBlogs = async () => {
    return findPopularBlogs();
};


export const likeBlog = async (
    userId: number,
    blogId: number
) => {
    const blog = await findBlogById(blogId);

    if (!blog) {
        throw new NotFoundError("Blog not found");
    }

    if (blog.status !== BlogStatus.APPROVED) {
        throw new BadRequestError(
            "Only approved blogs can be liked"
        );
    }

    const existingLike = await findBlogLike(userId, blogId);

    if (existingLike) {
        throw new BadRequestError(
            "You have already liked this blog"
        );
    }

    try {
        return await createBlogLike(userId, blogId);
    } catch (error: any) {
        // Two simultaneous requests both passed the check above;
        // the unique (userId, blogId) constraint rejected the second one.
        if (error?.code === "P2002") {
            throw new BadRequestError("You have already liked this blog");
        }
        throw error;
    }
};
export const unlikeBlog = async (
    userId: number,
    blogId: number
) => {
    const existingLike = await findBlogLike(userId, blogId);

    if (!existingLike) {
        throw new NotFoundError(
            "You have not liked this blog"
        );
    }

    try {
        return await deleteBlogLike(userId, blogId);
    } catch (error: any) {
        if (error?.code === "P2025") {
            throw new NotFoundError("You have not liked this blog");
        }
        throw error;
    }
};