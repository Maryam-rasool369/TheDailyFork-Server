import { Request, Response, NextFunction } from "express";
import { approveBlog, createBlog, deleteBlog, getAllBlogsForAdmin, getApprovedBlogs, getMyBlogs, rejectBlog, updateBlog } from "../services/blog.service";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";

export const getApprovedBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogs = await getApprovedBlogs();

        return res.status(200).json({
            success: true,
            data: blogs,
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
        const { id: authorId } = req.currentUser!;

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
        const { id: authorId } = req.currentUser!;
        const blogs = await getMyBlogs(authorId);

        return res.status(200).json({
            success: true,
            data: blogs,
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


export const getAllBlogsForAdminController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogs = await getAllBlogsForAdmin();

        return res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

export const approveBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const blog = await approveBlog(blogId);

        return res.status(200).json({
            success: true,
            message: "Blog approved",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

export const rejectBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const blog = await rejectBlog(blogId);

        return res.status(200).json({
            success: true,
            message: "Blog rejected",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};