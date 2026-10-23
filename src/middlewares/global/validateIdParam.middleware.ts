import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

export const validateIdParam = (req: Request, _res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return next(new BadRequestError("Invalid blog id"));
    }

    next();
};
