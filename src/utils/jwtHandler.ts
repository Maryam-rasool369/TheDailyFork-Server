import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AUTH_TOKEN_EXPIRY, RESET_TOKEN_EXPIRY } from "../comman/constants";
import { AuthTokenPayload, ResetTokenPayload } from "../comman/types";

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