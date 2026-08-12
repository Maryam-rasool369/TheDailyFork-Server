import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db";
import { UnauthorizedError } from "../../utils/errors";

// Use on login: fails if no user has this email. Attaches the found
// user to req.existingUser so the login service/controller doesn't
// need to re-query the same row.
export const requireUserExistsByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        // Same generic message login already throws on bad password —
        // don't reveal here whether the email exists.
        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        req.existingUser = user;
        next();
    } catch (err) {
        next(err);
    }
};