import { prisma } from "../config/db";
import { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation";
import { BlogStatus } from "../comman/enum";
import { GetBlogsQuery, GetMyBlogsQuery } from "../validations/blog.validation";

export const findApprovedBlogs = async ({ page, limit, search, category, sortBy }: GetBlogsQuery) => {
    const where = {
        status: BlogStatus.APPROVED,
        ...(search
            ? { title: { contains: search, mode: "insensitive" as const } }
            : {}),
        ...(category && category !== "All"
            ? { category: { name: { equals: category, mode: "insensitive" as const } } }
            : {}),
    };

    const [blogs, total] = await prisma.$transaction([
        prisma.blog.findMany({
            where,
            select: {
                id: true,
                title: true,
                shortDescription: true,
                imageUrl: true,
                categoryId: true,
                authorId: true,
                status: true,
                createdAt: true,
                updatedAt: true,

                category: { select: { id: true, name: true } },
                author: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
                _count: { select: { blogLikes: true } },
            },
            // id as a tiebreaker keeps page boundaries stable
            orderBy: [
                { createdAt: sortBy === "Oldest" ? "asc" : "desc" },
                { id: "desc" },
            ],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.blog.count({ where }),
    ]);

    return { blogs, total };
};

export const findBlogsByAuthor = async (
    authorId: number,
    { page, limit, search }: GetMyBlogsQuery
) => {
    const where = {
        authorId,
        ...(search
            ? { title: { contains: search, mode: "insensitive" as const } }
            : {}),
    };

    const [blogs, total] = await prisma.$transaction([
        prisma.blog.findMany({
            where,
            select: {
                id: true,
                title: true,
                shortDescription: true,
                imageUrl: true,
                categoryId: true,
                authorId: true,
                status: true,
                createdAt: true,
                updatedAt: true,

                category: { select: { id: true, name: true } },
                author: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
                _count: { select: { blogLikes: true } },
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.blog.count({ where }),
    ]);

    return { blogs, total };
};

export const findBlogById = async (blogId: number) => {
    return prisma.blog.findUnique({
        where: { id: blogId },
        include: {
            category: { select: { id: true, name: true } },
            author: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
            _count: {
                select: {
                    blogLikes: true,
                },
            },
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
        data: {
            status,
            // A blog that is no longer approved can't stay featured
            ...(status !== BlogStatus.APPROVED && { featuredOrder: null }),
        },
        include: {
            category: true,
            author: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, profileImage: true } },
        },
    });
};


export const findPopularBlogs = async () => {
    return prisma.blog.findMany({
        where: {
            status: BlogStatus.APPROVED,
        },

        select: {
            id: true,
            title: true,
            shortDescription: true,
            imageUrl: true,
            categoryId: true,
            authorId: true,
            status: true,
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

        orderBy: [
            {
                blogLikes: {
                    _count: "desc",
                },
            },
            {
                createdAt: "desc",
            },
            {
                id: "desc",
            },
        ],

        take: 3,
    });
};

export const findBlogLike = async (
    userId: number,
    blogId: number
) => {
    return prisma.blogLike.findUnique({
        where: {
            userId_blogId: {
                userId,
                blogId,
            },
        },
    });
};

export const createBlogLike = async (
    userId: number,
    blogId: number
) => {
    return prisma.blogLike.create({
        data: {
            userId,
            blogId,
        },
    });
};
export const deleteBlogLike = async (
    userId: number,
    blogId: number
) => {
    return prisma.blogLike.delete({
        where: {
            userId_blogId: {
                userId,
                blogId,
            },
        },
    });
};
export const findLikedBlogIds = async (userId: number, blogIds: number[]) => {
    const likes = await prisma.blogLike.findMany({
        where: { userId, blogId: { in: blogIds } },
        select: { blogId: true },
    });
    return new Set(likes.map((l) => l.blogId));
};

export const findBlogsPendingDigest = async () => {
    return prisma.blog.findMany({
        where: { status: BlogStatus.APPROVED, notifiedAt: null },
        select: {
            id: true,
            title: true,
            shortDescription: true,
            category: {
                select: { name: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        }

    })
}

export const markBlogsNotified = async (blogIds:number[]) => {
    return prisma.blog.updateMany({
        where: {
            id: { in: blogIds },
            notifiedAt: null
        },
        data:{
            notifiedAt: new Date()
        }

    })

}