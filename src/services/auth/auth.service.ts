import { BadRequestError } from "../../utils/errors";
import { SignupInput } from "../../validations/auth.validation";
import { env } from "../../config/env";
import { sendEmail } from "../email.service";
import { passwordResetTemplate, verifyEmailTemplate } from "../../templates/auth.template";
import { generateAuthToken, generateResetToken, generateVerifyEmailToken, verifyToken } from "../../utils/jwtHandler";
import { hashPassword, validatePassword } from "../../utils/password";
import { createUser, findUserById, updateUserPassword, markUserVerified } from "../../repositories/user.repository";
import { getOrCreateRole } from "../../repositories/role.repository";
import { AuthTokenPayload, ResetTokenPayload, VerifyEmailTokenPayload } from "../../comman/types";
import { deleteExpiredRevokedTokens, revokeToken } from "../../repositories/revokedToken.repository";
import { User } from "../../comman/types"; //changes back to the use from the generated folder
import { Role } from "../../comman/enum";
import { setNewPassword } from "../password.service";


export const signup = async (
    data: SignupInput
) => {
    const { firstName, lastName, email, password } = data;
    const hashedPassword = await hashPassword(password);

    const role = await getOrCreateRole(Role.USER);

    const user = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: role.id,
    });

    const verifyToken = generateVerifyEmailToken({
        id: user.id,
        purpose: "verify-email",
    });

    const verifyLink = `${env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    const html = verifyEmailTemplate(verifyLink);

    await sendEmail(user.email, "Verify Your Email", html);

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
};

export const login = async (
    password: string,
    user: User
) => {
    if (!user.password) {
        throw new BadRequestError("This account uses Google sign-in. Please log in with Google instead.");
    }
    if (!user.isVerified) {
        throw new BadRequestError("Please verify your email before logging in. Check your inbox for the verification link.");
    }
    await validatePassword(password, user.password);

    const token = generateAuthToken({
        id: user.id,
        email: user.email,
    });

    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    };
};


export const forgetPassword = async (user: User) => {
    
    if (!user.password) {
        throw new BadRequestError("This account doesn't have a password. Please log in with Google.");
    }
    const resetToken = generateResetToken({
        id: user.id,
        purpose: "reset-password",
        pwdHash: user.password,
    });

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = passwordResetTemplate(resetLink);

    const emailSendingInfo = await sendEmail(
        user.email,
        "Reset Your Password",
        html
    );

    // console.log("Email send result:", emailSendingInfo);
};

export const resetPassword = async (
    token: string,
    newPassword: string
) => {
    let payload: ResetTokenPayload;

    try {
        payload = verifyToken<ResetTokenPayload>(token);
    } catch (err) {
        throw new BadRequestError("Invalid or expired token");
    }

    if (payload.purpose !== "reset-password") {
        throw new BadRequestError("Invalid token");
    }

    const user = await findUserById(payload.id);

    if (!user) {
        throw new BadRequestError("Invalid or expired token");
    }

    // Token becomes invalid once the user's password changes.
    if (user.password !== payload.pwdHash) {
        throw new BadRequestError("Invalid or expired token");
    }

    // made a common password service that will hash and update the user password
    await setNewPassword(user.id, newPassword);

};

export const verifyEmail = async (token: string) => {
    let payload: VerifyEmailTokenPayload;

    try {
        payload = verifyToken<VerifyEmailTokenPayload>(token);
    } catch (err) {
        throw new BadRequestError("Invalid or expired verification link");
    }

    if (payload.purpose !== "verify-email") {
        throw new BadRequestError("Invalid token");
    }

    const user = await findUserById(payload.id);

    if (!user) {
        throw new BadRequestError("Invalid or expired verification link");
    }

    if (!user.isVerified) {
        await markUserVerified(user.id);
    }
};

export const logout = async (token: string) => {
    // The token was already verified by authValidation; we only need its expiry
    const { exp } = verifyToken<AuthTokenPayload & { exp: number }>(token); //here the exp: number is the extension of the AuthTokenPayload interface.

    await revokeToken(token, new Date(exp * 1000));

    // Housekeeping: drop rows for tokens that have expired by now
    await deleteExpiredRevokedTokens();
};


