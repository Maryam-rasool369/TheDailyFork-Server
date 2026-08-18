import { NextFunction, Request, Response } from "express";
import { ConflictError } from "../../utils/errors";
import { findUserByEmail } from "../../repositories/user.repository";

// Use on signup: fails if the email is already registered.
export const rejectIfUserExistsByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            throw new ConflictError("Email already exists");
        }

        next();
    } catch (err) {
        next(err);
    }
};