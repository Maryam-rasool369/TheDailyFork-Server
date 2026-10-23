import { z } from "zod";

export const createBlogSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200),
    shortDescription: z.string().trim().min(1, "Short description is required").max(500),
    content: z.string().trim().min(1, "Content is required"),
    categoryId: z.coerce.number().int().positive("Category is required"),
});

export const updateBlogSchema = createBlogSchema.partial();

export const setFeaturedBlogsSchema = z.object({
    blogIds: z
        .array(z.number().int().positive())
        .length(3),
});

export const getBlogsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(5),
    search: z.string().trim().max(100).optional(),
    category: z.string().trim().max(100).optional(),
    sortBy: z.enum(["Latest", "Oldest"]).default("Latest"),
});
export const getMyBlogsQuerySchema = getBlogsQuerySchema.pick({
    page: true,
    limit: true,
    search: true,
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type SetFeaturedBlogsInput = z.infer<typeof setFeaturedBlogsSchema>;
export type GetBlogsQuery = z.infer<typeof getBlogsQuerySchema>;
export type GetMyBlogsQuery = z.infer<typeof getMyBlogsQuerySchema>;
