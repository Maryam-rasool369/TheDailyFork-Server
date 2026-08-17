// import { Request, Response, NextFunction } from "express";
// import {
//     updateProfile, updateProfileImage, changePassword, getProfile,
// } from "../services/profile.service";
// import { uploadToCloudinary } from "../utils/uploadToCloudinary";
// import { BadRequestError } from "../utils/errors";

// export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await getProfile(req.currentUser!.id);

//         return res.status(200).json({
//             success: true,
//             data: user,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { firstName, lastName, gender, birthday, phoneNumber, bio } = req.body
//         const user = await updateProfile(
//             req.currentUser!.id,
//             { firstName, lastName, gender, birthday, phoneNumber, bio }
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             data: user,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const updateProfileImageController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (!req.file) {
//             throw new BadRequestError("Profile image is required");
//         }

//         const imageUrl = await uploadToCloudinary(req.file.buffer, "profile-images");
//         const user = await updateProfileImage(req.currentUser!.id, imageUrl);

//         return res.status(200).json({
//             success: true,
//             message: "Profile picture updated successfully",
//             data: user,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { currentPassword, newPassword } = req.body;
//         await changePassword(req.currentUser!.id, { currentPassword, newPassword });

//         return res.status(200).json({
//             success: true,
//             message: "Password changed successfully",
//         });
//     } catch (error) {
//         next(error);
//     }
// };