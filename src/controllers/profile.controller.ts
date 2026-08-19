import { Request, Response, NextFunction } from "express";
import { changePassword, getProfile, updateProfile } from "../services/profile.service";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { UpdateProfileInput, ChangePasswordInput } from "../validations/profile.validation";

export const getProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser!;
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
        const data: UpdateProfileInput = req.body;
        const { id } = req.currentUser!;

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

export const changePasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: ChangePasswordInput = req.body;
        const { id } = req.currentUser!;
        await changePassword(id, data);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};