import { Request, Response, NextFunction } from "express";
import {
    createBlog, deleteBlog, getApprovedBlogs, getBlogById, getMyBlogs, getPopularBlogs, updateBlog, likeBlog,
    unlikeBlog,
} from "../services/blog.service";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { CreateBlogInput, GetBlogsQuery, GetMyBlogsQuery, UpdateBlogInput } from "../validations/blog.validation";
import { getBlogForViewer } from "../services/subscription/blogAccess.service";
import { findLikedBlogIds } from "../repositories/blog.repository";

export const getBlogByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);

        // Set by the authValidation middleware if a valid token was present;
        // undefined for anonymous visitors.
        const currentUser = req.body.currentUser;

        const blog = await getBlogForViewer(blogId, currentUser);

        const isLiked = currentUser
            ? (await findLikedBlogIds(currentUser.id, [blogId])).has(blogId)
            : false;

        return res.status(200).json({
            success: true,
            data: { ...blog, isLiked },
        });

    } catch (error) {
        next(error);
    }
};

export const getApprovedBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const query = res.locals.query as GetBlogsQuery;
        const { blogs, pagination } = await getApprovedBlogs(query);
        const currentUser = req.body?.currentUser;

        const likedIds = currentUser
            ? await findLikedBlogIds(currentUser.id, blogs.map((b) => b.id))
            : new Set<number>();

        return res.status(200).json({
            success: true,
            data: {
                blogs: blogs.map((b) => ({ ...b, isLiked: likedIds.has(b.id) })),
                pagination,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const createBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: CreateBlogInput = req.body;
        const { id: authorId } = req.body.currentUser!;

        const imageUrl = await uploadToCloudinary(req.file!.buffer);
        const blog = await createBlog(data, authorId, imageUrl);

        return res.status(201).json({
            success: true,
            message: "Blog submitted for approval",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.body.currentUser!;
        const query = res.locals.query as GetMyBlogsQuery;

        const result = await getMyBlogs(id, query);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getBlogForEditController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);

        const blog = await getBlogById(blogId);

        return res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};
export const updateBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const data: UpdateBlogInput = req.body;

        let imageUrl: string | undefined;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        // Just for development purposes
        // console.log("UPDATE BLOG BODY:", req.body);
        // console.log("UPDATE BLOG FILE:", req.file);

        const blog = await updateBlog(blogId, data, imageUrl);

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        await deleteBlog(blogId);

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const getPopularBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogs = await getPopularBlogs();

        return res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

export const likeBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const { id: userId } = req.body.currentUser!;

        await likeBlog(userId, blogId);

        return res.status(201).json({
            success: true,
            message: "Blog liked successfully",
        });
    } catch (error) {
        next(error);
    }
};
export const unlikeBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const { id: userId } = req.body.currentUser!;

        await unlikeBlog(userId, blogId);

        return res.status(200).json({
            success: true,
            message: "Blog unliked successfully",
        });
    } catch (error) {
        next(error);
    }
};