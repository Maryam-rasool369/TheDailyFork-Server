import { Request, Response, NextFunction } from "express";
import { getUsersForAdmin, getSubscribersForAdmin, getAdminStats, adminLogin, setFeaturedBlogsServiceForAdmin, getFeaturedBlogs, getAllBlogsForAdmin, rejectBlogByAdmin,approveBlogByAdmin } from "../services/admin.service";

export const adminLoginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { password, existingUser } = req.body;
        const adminUser = existingUser!;


        const result = await adminLogin(password, adminUser);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}


export const getAdminStatsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stats = await getAdminStats();

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminUsersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await getUsersForAdmin();

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminSubscriptionsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const subscribers = await getSubscribersForAdmin();

        return res.status(200).json({
            success: true,
            data: subscribers,
        });
    } catch (error) {
        next(error);
    }
};

// Blogs related controllers for admin 

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

export const approveBlogControllerForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const blog = await approveBlogByAdmin(blogId);

        return res.status(200).json({
            success: true,
            message: "Blog approved",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

export const rejectBlogControllerForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);
        const blog = await rejectBlogByAdmin(blogId);

        return res.status(200).json({
            success: true,
            message: "Blog rejected",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

export const setAdminFeaturedBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { blogIds } = req.body;

        const blogs = await setFeaturedBlogsServiceForAdmin(blogIds);

        return res.status(200).json({
            success: true,
            message: "Featured blogs updated successfully",
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

export const getFeaturedBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogs = await getFeaturedBlogs();

        return res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};
