import { prisma } from "../config/db";
import { BlogStatus } from "../comman/enum";

const ADMIN_USER_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    profileImage: true,
    isVerified: true,
    createdAt: true,
    role: { select: { name: true } },
    subscription: true,
} as const;

export const findAllUsersForAdmin = async () => {
    return prisma.user.findMany({
        select: ADMIN_USER_SELECT,
        orderBy: { createdAt: "desc" },
    });
};

export const findAllSubscribersForAdmin = async () => {
    return prisma.user.findMany({
        where: { subscription: { isNot: null } },
        select: ADMIN_USER_SELECT,
        orderBy: { subscription: { createdAt: "desc" } },
    });
};

export const getAdminStatsData = async () => {
    const [
        totalUsers,
        totalBlogs,
        pendingBlogs,
        approvedBlogs,
        rejectedBlogs,
        activeSubscriptions,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.blog.count(),
        prisma.blog.count({ where: { status: BlogStatus.PENDING } }),
        prisma.blog.count({ where: { status: BlogStatus.APPROVED } }),
        prisma.blog.count({ where: { status: BlogStatus.REJECTED } }),
        prisma.subscription.count({ where: { status: { in: ["active", "trialing"] } } }),
    ]);

    return {
        totalUsers,
        totalBlogs,
        pendingBlogs,
        approvedBlogs,
        rejectedBlogs,
        activeSubscriptions,
    };
};

// Blogs related repository functions for admin

export const findAllBlogsForAdmin = async () => {
    return prisma.blog.findMany({
        include: {
            category: true,
            author: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};


export const findBlogsByIdsForAdmin = async (blogIds: number[]) => {
    return prisma.blog.findMany({
        where: {
            id: {
                in: blogIds,
            },
        },
        select: {
            id: true,
            status: true,
        },
    });
};

export const findFeaturedBlogsForAdmin = async () => {
    return prisma.blog.findMany({
        where: {
            status: BlogStatus.APPROVED,
            featuredOrder: {
                not: null,
            },
        },
        select: {
            id: true,
            title: true,
            shortDescription: true,
            imageUrl: true,
            categoryId: true,
            authorId: true,
            status: true,
            featuredOrder: true,
            createdAt: true,
            updatedAt: true,

            category: {
                select: {
                    id: true,
                    name: true,
                },
            },

            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                },
            },

            _count: {
                select: {
                    blogLikes: true,
                },
            },
        },

        orderBy: {
            featuredOrder: "asc",
        },
    });
};

export const setFeaturedBlogsForAdmin = async (blogIds: number[]) => {
    return prisma.$transaction(async (tx) => {
        // Remove current featured positions
        await tx.blog.updateMany({
            where: {
                featuredOrder: {
                    not: null,
                },
            },
            data: {
                featuredOrder: null,
            },
        });

        // Assign new positions
        for (let index = 0; index < blogIds.length; index++) {
            await tx.blog.update({
                where: {
                    id: blogIds[index],
                },
                data: {
                    featuredOrder: index + 1,
                },
            });
        }

        return tx.blog.findMany({
            where: {
                featuredOrder: {
                    not: null,
                },
            },
            orderBy: {
                featuredOrder: "asc",
            },
        });
    });
};