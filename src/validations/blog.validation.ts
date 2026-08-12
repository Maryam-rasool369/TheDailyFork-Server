import { z } from "zod";

export const createBlogSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200),
    shortDescription: z.string().trim().min(1, "Short description is required").max(500),
    content: z.string().trim().min(1, "Content is required"),
    categoryId: z.coerce.number().int().positive("Category is required"),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;