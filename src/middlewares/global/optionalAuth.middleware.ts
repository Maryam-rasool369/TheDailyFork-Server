import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwtHandler";
import { prisma } from "../../config/db";
import { AuthTokenPayload } from "../../comman/types";
import { isTokenRevoked } from "../../repositories/revokedToken.repository";

// Same as authValidation, but never blocks the request.
// If a valid Bearer token is present, req.body.currentUser is populated.
// If it's missing/invalid/expired, the request just continues as anonymous.
export const optionalAuthValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.body = { ...(req.body || {}) };
            return next();
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyToken<AuthTokenPayload>(token);

        // Logged-out token -> continue as anonymous
        if (await isTokenRevoked(token)) {
            req.body = { ...(req.body || {}) };
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { role: true },
        });

        req.body = { ...(req.body || {}), currentUser: user ?? undefined };

        next();
    } catch (err) {
        // Invalid/expired token -> treat as anonymous instead of failing the request
        req.body = { ...(req.body || {}) };
        next();
    }
};
