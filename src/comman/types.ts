import { AuthProvider, BlogStatus, Gender, SubscriptionPlan } from "./enum";

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

// For email verification token
export interface VerifyEmailTokenPayload {
    id: number;
    purpose: "verify-email";
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
    password: string | null;
    email: string;
    googleId: string | null;
    authProvider: AuthProvider;
    profileImage: string | null;
    bio: string | null;
    gender: Gender | null;
    birthday: Date | null;
    phoneNumber: string | null;

    isVerified: boolean;

    roleId: number;
    isAdmin: boolean;

    stripeCustomerId: string | null;

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

export interface EmailAttachment {
    content: string;
    filename: string;
    type: string;
    disposition?: string;
}

// For subscription service
export type AccessLevel = "full" | "preview" | "paywalled";

// // For blog access service
// export interface Viewer {
//     id: number;
//     email: string;
// }

export type BlogViewerResponse = {
    id: number;
    title: string;
    content: string;
    shortDescription: string;
    imageUrl: string;
    categoryId: number;
    authorId: number;
    status: BlogStatus;
    createdAt: Date;
    updatedAt: Date;

    category: {
        id: number;
        name: string;
    };

    author: {
        id: number;
        firstName: string;
        lastName: string | null;
        profileImage: string | null;
    };

    access: AccessLevel;
    requiresLogin: boolean;
    requiresPayment: boolean;
};

export interface UpsertSubscriptionInput {
    userId: number;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: string;
    plan: SubscriptionPlan;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
}

// For digest service sceduling 
export interface DigestBlog {
    id:number;
    title:string;
    shortDescription:string;
    categoryName:string;
}

export interface DigestEmailJobData {
    to: string;
    firstName: string;
    blogs: DigestBlog[];
}
