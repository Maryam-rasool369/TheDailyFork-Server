import { Request, Response, NextFunction } from "express";
import { signup, login, forgetPassword, resetPassword } from "../services/auth.service";

export const signupController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = await signup({ firstName, lastName, email, password });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        // req.existingUser is attached by requireUserExistsByEmail middleware,
        // guaranteed to exist by the time we get here
        const result = await login({ email, password }, req.existingUser!);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const forgetPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        await forgetPassword(email);

        return res.status(200).json({
            success: true,
            message: "If that email exists, a reset link has been sent",
        });
    } catch (error) {
        next(error);
    }
};

export const resetPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token, newPassword } = req.body;

        await resetPassword(token, newPassword);

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        next(error);
    }
};