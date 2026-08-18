import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

export const requireFile = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        throw new BadRequestError("Blog image is required");
    }

    next();
};