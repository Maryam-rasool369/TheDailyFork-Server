import * as userRepository from "../repositories/user.repository";
import { UpdateProfileInput, ChangePasswordInput } from "../validations/profile.validation";
import { UnauthorizedError, NotFoundError } from "../utils/errors";
import { toPublicUser } from "../utils/formatUser";
import { hashPassword, comparePassword } from "../utils/password";
import { setNewPassword } from "./password.service";

export const getProfile = async (userId: number) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return toPublicUser(user);
};

// Handles both text fields and an optional new picture — one page, one save action
export const updateProfile = async (
    userId: number,
    data: UpdateProfileInput,
    profileImage?: string
) => {
    const user = await userRepository.updateUserProfile(userId, data, profileImage);
    return toPublicUser(user);
};

export const changePassword = async (userId: number, data: ChangePasswordInput) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new UnauthorizedError("Current password is incorrect");
    }

    await setNewPassword(userId, data.newPassword);


    return;
};