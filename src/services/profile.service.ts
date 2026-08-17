import { prisma } from "../config/db";
import bycrpt from "bcrypt";
import { UpdateProfileInput, ChangePasswordInput } from "../validations/profile.validation";
import { UnauthorizedError, BadRequestError } from "../utils/errors";
import { SALT_ROUNDS } from "../comman/constants";
import { toPublicUser } from "../utils/formatUser";

export const getProfile = async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new BadRequestError("User not found");
    }

    return toPublicUser(user);
};

export const updateProfile = async (userId: number, data: UpdateProfileInput) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
    });

    return toPublicUser(user);
};

export const updateProfileImage = async (userId: number, imageUrl: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl },
    });

    return toPublicUser(user);
};

export const changePassword = async (userId: number, data: ChangePasswordInput) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new BadRequestError("User not found");
    }

    const isCurrentPasswordValid = await bycrpt.compare(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await bycrpt.hash(data.newPassword, SALT_ROUNDS);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return;
};

