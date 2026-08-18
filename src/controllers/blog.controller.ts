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
    getBlogById,
} from "../services/blog.service";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { BadRequestError } from "../utils/errors";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { getCategoryById } from "../services/category.service";

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

export const createBlogController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const imageUrl = await uploadToCloudinary(req.file!.buffer);
        const data: CreateBlogInput = req.body; //same as  const { title, shortDescription, content, categoryId } = req.body;

        const { id } = req.currentUser!

        await getCategoryById(data.categoryId);

        const blog = await createBlog(data, id, imageUrl);

        return res.status(201).json({
            success: true,
            message: "Blog submitted for approval",
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

        let imageUrl: string | undefined;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const data: UpdateBlogInput = req.body; //same as const { title, shortDescription, content, categoryId, }: UpdateBlogInput = req.body;


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
        await getBlogById(blogId);

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
        await getBlogById(blogId);

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