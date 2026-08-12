import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../utils/errors";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser?.role.name !== "ADMIN") {
        return next(new ForbiddenError("Admin access required"));
    }
    next();
};