import { Gender } from "./enum";

// For login
export interface AuthTokenPayload {
    id: number;
    email: string;
}
// For reset password token
export interface ResetTokenPayload {
    id: number;
    purpose: "reset-password";
    pwdHash: string;
}

export interface CreateUserInput {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    roleId: number;
};

export interface User {
    id: number;
    firstName: string;
    lastName: string | null;
    email: string;
    password: string;
    profileImage: string | null;
    bio: string | null;
    gender: Gender | null;
    birthday: Date | null;
    phoneNumber: string | null;
    isVerified: boolean;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
};