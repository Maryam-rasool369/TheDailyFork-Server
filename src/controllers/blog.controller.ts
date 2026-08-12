import { Request, Response, NextFunction } from "express";
import {
    createBlog,
    updateBlog,
    deleteBlog,
    getMyBlogs,
    getApprovedBlogs,
    getAllBlogsForAdmin,
    approveBlog,
    rejectBlog,
} from "../services/blog.service";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { BadRequestError } from "../utils/errors";
import { UpdateBlogInput } from "../validations/blog.validation";

export const createBlogController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new BadRequestError("Blog image is required");
        }

        const imageUrl = await uploadToCloudinary(req.file.buffer);
        // const blog = await createBlog(req.body, req.currentUser!.id, imageUrl);
        const { title, shortDescription, content, categoryId } = req.body;
        const { id } = req.currentUser!
        const blog = await createBlog({ title, shortDescription, content, categoryId }, id, imageUrl);

        return res.status(201).json({
            success: true,
            message: "Blog submitted for approval",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

export const updateBlogController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = Number(req.params.id);
        let imageUrl: string | undefined;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const { title, shortDescription, content, categoryId } = req.body;

        const updateData: UpdateBlogInput = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (shortDescription !== undefined) {
            updateData.shortDescription = shortDescription;
        }

        if (content !== undefined) {
            updateData.content = content;
        }

        if (categoryId !== undefined) {
            updateData.categoryId = Number(categoryId);
        }

        const blog = await updateBlog(blogId, updateData, imageUrl);

        // const { title, shortDescription, content, categoryId } = req.body;
        // const blog = await updateBlog(blogId, req.body, imageUrl);

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });

    } catch (error) {
        next(error);
    }
};

export const deleteBlogController = async (req: Request, res: Response, next: NextFunction) => {
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

export const getMyBlogsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentUser } = req.body
        const blogs = await getMyBlogs(currentUser!.id);

        return res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

export const getApprovedBlogsController = async (req: Request, res: Response, next: NextFunction) => {
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

export const getAllBlogsForAdminController = async (req: Request, res: Response, next: NextFunction) => {
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

export const approveBlogController = async (req: Request, res: Response, next: NextFunction) => {
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

export const rejectBlogController = async (req: Request, res: Response, next: NextFunction) => {
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