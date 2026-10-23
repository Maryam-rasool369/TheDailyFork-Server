import { findAllUsersForAdmin, findAllSubscribersForAdmin, getAdminStatsData, findFeaturedBlogsForAdmin, findBlogsByIdsForAdmin, setFeaturedBlogsForAdmin } from "../repositories/admin.repository";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { validatePassword } from "../utils/password";
import { generateAuthToken } from "../utils/jwtHandler";
import { User } from "../comman/types";
import { findAllBlogsForAdmin} from "../repositories/admin.repository";
import { BlogStatus } from "../comman/enum";
import { updateBlogStatus } from "../repositories/blog.repository";
import { getBlogById } from "./blog.service";


export const adminLogin = async (
    password: string,
    adminUser: User
) => {
    if (!adminUser.password) {
        throw new BadRequestError("This account uses Google sign-in. Please log in with Google instead.");
    }
    if (!adminUser.isVerified) {
        throw new BadRequestError("Please verify your email before logging in. Check your inbox for the verification link.");
    }
    if (!adminUser.isAdmin) {
        throw new BadRequestError("Only administrators can log in.");
    }
    await validatePassword(password, adminUser.password);

    const token = generateAuthToken({
        id: adminUser.id,
        email: adminUser.email,
    });

    return {
        token,
        user: {
            id: adminUser.id,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            email: adminUser.email,
            roleId: adminUser.roleId, // Assuming roleId is a number representing the user's role
        },
    };
};

export const getUsersForAdmin = async () => {
    const users = await findAllUsersForAdmin();

    return users.map((user) => ({
        ...user,
        role: user.role.name,
    }));
};

export const getSubscribersForAdmin = async () => {
    const users = await findAllSubscribersForAdmin();

    return users.map((user) => ({
        ...user,
        role: user.role.name,
    }));
};

export const getAdminStats = async () => {
    return getAdminStatsData();
};
// Blogs related services for admin
export const getAllBlogsForAdmin = async () => {
    return findAllBlogsForAdmin();
};
export const approveBlogByAdmin = async (blogId: number) => {
    await getBlogById(blogId);
    return updateBlogStatus(blogId, BlogStatus.APPROVED);
};

export const rejectBlogByAdmin = async (blogId: number) => {
    await getBlogById(blogId);
    return updateBlogStatus(blogId, BlogStatus.REJECTED);
}

export const getFeaturedBlogs = async () => {
    return findFeaturedBlogsForAdmin();
};

export const setFeaturedBlogsServiceForAdmin = async (blogIds: number[]) => {
    if (blogIds.length !== 3) {
        throw new BadRequestError(
            "Exactly 3 blogs must be selected for the featured section"
        );
    }

    const uniqueBlogIds = new Set(blogIds);

    if (uniqueBlogIds.size !== 3) {
        throw new BadRequestError(
            "Featured blogs must be different"
        );
    }

    const blogs = await findBlogsByIdsForAdmin(blogIds);

    if (blogs.length !== 3) {
        throw new NotFoundError(
            "One or more selected blogs were not found"
        );
    }

    const hasNonApprovedBlog = blogs.some(
        (blog) => blog.status !== BlogStatus.APPROVED
    );

    if (hasNonApprovedBlog) {
        throw new BadRequestError(
            "Only approved blogs can be featured"
        );
    }

    return  setFeaturedBlogsForAdmin(blogIds);
};
    