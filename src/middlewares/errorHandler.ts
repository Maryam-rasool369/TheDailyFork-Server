import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Unknown/unexpected error — log full detail, but never leak internals to client
    console.error("UNEXPECTED ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
    });
};