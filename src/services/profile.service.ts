import { findUserById, updateUserProfile } from "../repositories/user.repository";
import { UpdateProfileInput, ChangePasswordInput } from "../validations/profile.validation";
import { UnauthorizedError, NotFoundError, BadRequestError } from "../utils/errors";
import { toPublicUser } from "../utils/formatUser";
import { comparePassword } from "../utils/password";
import { setNewPassword } from "./password.service";
import { User } from "../comman/types";

export const getProfile = async (userId: number) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return toPublicUser(user as User);
};

export const updateProfile = async (
    userId: number,
    data: UpdateProfileInput,
    profileImage?: string
) => {
    const user = await updateUserProfile(userId, data, profileImage);
    return toPublicUser(user as User);
};

// Checks the current password only — does not change anything.
// Used by the "Verify Password" step before showing the new-password fields.
export const verifyCurrentPassword = async (userId: number, currentPassword: string) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }
    if (!user.password) {
        throw new BadRequestError("This account doesn't have a password set yet.");
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
        throw new UnauthorizedError("Current password is incorrect");
    }

    return;
};

export const changePassword = async (userId: number, data: ChangePasswordInput) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }
    if (!user.password) {
        throw new BadRequestError("This account doesn't have a password set yet. Set one before changing it.");
    }

    const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new UnauthorizedError("Current password is incorrect");
    }

    await setNewPassword(userId, data.newPassword);

    return;
};