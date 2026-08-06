import { Request, Response, NextFunction } from "express";
import { forgetPassword, login, resetPassword, signup } from "../services/auth.service";


export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        const user = await signup({ firstName, lastName, email, password });
        return res.status(201).json({
            success: true,
            message: "User signup successful.",
            data: user
        });

    } catch (error: any) {

        if (error.message === "Email already exists.") {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }

}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await login({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: user
        })
    }
    catch (error: any) {

        if (error.message === "User not found.") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === "Invalid Password.") {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        next(error);

    }
}

// export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email } = req.body;
//         if (!email) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email is required.",
//             });
//         }

//         await forgetPassword({email})

//     } catch (error) {

//     }
// }

export const forgetPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        await forgetPassword(email);

        // Same response whether or not the email exists
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

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required",
            });
        }

        await resetPassword(token, newPassword);

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error: any) {
        if (error.message === "Invalid or expired token") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        next(error);
    }
};