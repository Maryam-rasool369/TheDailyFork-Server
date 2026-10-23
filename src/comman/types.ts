import { AuthProvider, Gender } from "./enum";

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
//why did we separatly created the user when we already have generated/client one /
export interface User {
    id: number;
    googleId: string | null;
    authProvider: AuthProvider;
    firstName: string;
    lastName: string | null;
    email: string;
    password: string | null;
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


export interface GoogleUserPayload {
    googleId: string;
    email: string;
    firstName: string;
    lastName?: string;
    profileImage?: string;
}
