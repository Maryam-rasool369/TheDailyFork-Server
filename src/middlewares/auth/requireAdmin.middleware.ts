import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../utils/errors";
import { Role } from "../../comman/enum";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.currentUser?.role.name !== Role.ADMIN) {
        return next(new ForbiddenError("Admin access required"));
    }
    next();
};