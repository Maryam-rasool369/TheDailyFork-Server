import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db";
import { ConflictError } from "../../utils/errors";

// Use on signup: fails if the email is already registered.
export const rejectIfUserExistsByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new ConflictError("Email already exists");
        }

        next();
    } catch (err) {
        next(err);
    }
};