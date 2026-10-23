import { Request, Response, NextFunction } from "express";
import { forgetPassword, login, logout, resetPassword, signup, verifyEmail } from "../services/auth/auth.service";
import { SignupInput } from "../validations/auth.validation";
import { googleLogin } from "../services/auth/googleAuth.service";
import { generateAuthToken } from "../utils/jwtHandler";
import { BadRequestError } from "../utils/errors";

export const signupController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: SignupInput = req.body;

        const user = await signup(
            data
        );

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};

export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password,existingUser } = req.body;
        const user = existingUser!;


        const result = await login(password, user); //should we make 

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
        const user = req.body.existingUser!;

        await forgetPassword(user);

        return res.status(200).json({
            success: true,
            message: "Password reset link has been sent",
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

export const verifyEmailController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.query as { token: string }; // query is after ? in the url, and params are part of the url
        
        if (!token) {
            throw new BadRequestError("Token is required");
        }

        await verifyEmail(token);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Login with google

export const googleLoginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            throw new BadRequestError("Google ID token is required");
        }

        const user = await googleLogin(idToken);
        const token = generateAuthToken({ id: user.id, email: user.email });

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            data: { token, user },
        });
    } catch (error) {
        next(error);
    }
};
export const logoutController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // authValidation has already confirmed the Bearer header is present and valid
        const token = req.headers.authorization!.split(" ")[1];

        await logout(token);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
