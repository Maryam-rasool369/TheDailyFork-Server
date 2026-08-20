import { Role } from "../comman/enum";
import { CreateUserInput } from "../comman/types";
import { prisma } from "../config/db";
import { UpdateProfileInput } from "../validations/profile.validation";

export const findUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
    });
};
export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const createUser = async (data: CreateUserInput) => {
    return prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            roleId: data.roleId,
        },
    });
}

export const updateUserPassword = async (
    userId: number,
    hashedPassword: string
) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
        },
    });
};

export const updateUserProfile = async (
    userId: number,
    data: UpdateProfileInput,
    profileImage?: string
) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            ...data,
            ...(profileImage && { profileImage }),
        },
    });
};

