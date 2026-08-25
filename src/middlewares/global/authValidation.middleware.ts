import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwtHandler";
import { prisma } from "../../config/db";
import { UnauthorizedError } from "../../utils/errors";
import { AuthTokenPayload } from "../../comman/types";

export const authValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Not authenticated");
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyToken<AuthTokenPayload>(token);

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { role: true },
        });

        if (!user) {
            throw new UnauthorizedError("Not authenticated");
        }

        req.body.currentUser = user;
        next();
    } catch (err) {
        next(new UnauthorizedError("Not authenticated"));
    }
};