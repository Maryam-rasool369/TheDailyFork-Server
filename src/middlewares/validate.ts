import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { BadRequestError } from "../utils/errors";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");
            return next(new BadRequestError(message));
        }

        // overwrite req.body with parsed/sanitized data (e.g. lowercased email)
        req.body = result.data;
        next();
    };
};