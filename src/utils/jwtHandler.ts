import jwt from "jsonwebtoken";
import { env } from "../config/env";

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

const AUTH_TOKEN_EXPIRY = "7d";
const RESET_TOKEN_EXPIRY = "15m"; //For reset password token


export const generateAuthToken = (
    payload: AuthTokenPayload,
) => {
    return jwt.sign(
        payload,
        env.JWT_SECRET,
        { expiresIn: AUTH_TOKEN_EXPIRY }
    );
};
export const generateResetToken = (
    payload: ResetTokenPayload,

) => {
    return jwt.sign(
        payload,
        env.JWT_SECRET,
        { expiresIn: RESET_TOKEN_EXPIRY, }
    );
};

export const verifyToken = <T>(token: string): T => {
    return jwt.verify(
        token,
        env.JWT_SECRET as string
    ) as T;
};