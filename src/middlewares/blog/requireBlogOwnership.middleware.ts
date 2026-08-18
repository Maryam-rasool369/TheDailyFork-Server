import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../utils/errors";
import { BlogStatus } from "../../comman/enum";

// Use on edit/delete: blog must exist, belong to the current user,
// and be in APPROVED status (per your requirement).
export const requireBlogOwnership = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = Number(req.params.id);

        if (isNaN(blogId)) {
            throw new BadRequestError("Invalid blog id");
        }

        const blog = await prisma.blog.findUnique({ where: { id: blogId } });

        if (!blog) {
            throw new NotFoundError("Blog not found");
        }

        if (blog.authorId !== req.currentUser!.id) {
            throw new ForbiddenError("You do not own this blog");
        }

        if (blog.status !== BlogStatus.APPROVED) {
            throw new ForbiddenError("Only approved blogs can be edited or deleted");
        }

        req.blog = blog;
        next();
    } catch (err) {
        next(err);
    }
};