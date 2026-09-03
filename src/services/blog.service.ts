import { deleteBlogById, findAllBlogsForAdmin, findApprovedBlogs, findBlogById, findBlogsByAuthor, insertBlog, updateBlogById, updateBlogStatus } from "../repositories/blog.repository";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { NotFoundError } from "../utils/errors";
import { BlogStatus } from "../comman/enum";
import { getCategoryById } from "./category.service";

export const getApprovedBlogs = async () => {
    return findApprovedBlogs();
};

export const getMyBlogs = async (authorId: number) => {
    return findBlogsByAuthor(authorId);
};

export const getAllBlogsForAdmin = async () => {
    return findAllBlogsForAdmin();
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

export const approveBlog = async (blogId: number) => {
    await getBlogById(blogId);
    return updateBlogStatus(blogId, BlogStatus.APPROVED);
};

export const rejectBlog = async (blogId: number) => {
    await getBlogById(blogId);
    return updateBlogStatus(blogId, BlogStatus.REJECTED);
};