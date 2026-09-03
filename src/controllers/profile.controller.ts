import { Request, Response, NextFunction } from "express";
import { changePassword, getProfile, updateProfile, verifyCurrentPassword } from "../services/profile.service";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { UpdateProfileInput, ChangePasswordInput, VerifyPasswordInput } from "../validations/profile.validation";

export const getProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.body.currentUser!;
        const user = await getProfile(id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { currentUser, ...data } = req.body;
        const { id } = currentUser;

        let profileImage: string | undefined;
        if (req.file) {
            profileImage = await uploadToCloudinary(req.file.buffer, "profile-images");
        }

        const user = await updateProfile(id, data, profileImage);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { currentPassword }: VerifyPasswordInput = req.body;
        const { id } = req.body.currentUser!;

        await verifyCurrentPassword(id, currentPassword);

        return res.status(200).json({
            success: true,
            message: "Password verified",
        });
    } catch (error) {
        next(error);
    }
};

export const changePasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: ChangePasswordInput = req.body;
        const { id } = req.body.currentUser!;
        await changePassword(id, data);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};