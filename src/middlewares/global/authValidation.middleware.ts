import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwtHandler";
import { prisma } from "../../config/db";
import { UnauthorizedError } from "../../utils/errors";
import { AuthTokenPayload } from "../../comman/types";
import { isTokenRevoked } from "../../repositories/revokedToken.repository";

export const authValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        // console.log("AUTH HEADER:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Not authenticated");
        }

        const token = authHeader.split(" ")[1];

        // console.log("TOKEN:", token);

        const payload = verifyToken<AuthTokenPayload>(token);

        // console.log("JWT PAYLOAD:", payload);

        // Token is still valid, but the user logged out before it expired
        if (await isTokenRevoked(token)) {
            throw new UnauthorizedError("Not authenticated");
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { role: true },
        });

        // console.log("USER:", user);

        if (!user) {
            throw new UnauthorizedError("Not authenticated");
        }

        // req.body = { ...(req.body && req.body), currentUser: user };
        req.body = { ...(req.body || {}), currentUser: user }
        //If req.body exists, copy its properties; otherwise start with an empty object, then add an object to the req.body and then attach current user with it 

        next();
    } catch (err) {
        console.error("AUTH VALIDATION ERROR:", err);
        next(err);
    }
};