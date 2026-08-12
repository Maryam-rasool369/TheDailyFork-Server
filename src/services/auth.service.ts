import { UnauthorizedError, BadRequestError } from "../utils/errors";
import { SignupInput, LoginInput } from "../validations/auth.validation";
import { User } from "../generated/client";
import bycrpt from "bcrypt";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { sendEmail } from "../services/email.service";
import { passwordResetTemplate } from "../templates/passwordReset.template";
import { SALT_ROUNDS } from "../constants/constants";
import {
    generateAuthToken,
    generateResetToken,
    ResetTokenPayload,
    verifyToken,
} from "../utils/jwtHandler";

export const signup = async (data: SignupInput) => {
    const { firstName, lastName, email, password } = data;

    const hashedPassword = await bycrpt.hash(password, SALT_ROUNDS);

    const userRole = await prisma.role.findUnique({ where: { name: "USER" } }); // put this in a separate file

    if (!userRole) {
        throw new BadRequestError("Default role not configured");
    }

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            roleId: userRole.id,
        },
    });

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
};

export const login = async (data: LoginInput, user: User) => {
    const { password } = data;

    const isPasswordValid = await bycrpt.compare(password, user.password); 
    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateAuthToken({ id: user.id, email: user.email });

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

export const forgetPassword = async (email: any) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return;
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

    // Logging the info sent to user
    console.log("Email send result:", emailSendingInfo);

    // Nothing sensitive returned to the caller - token only goes out via email
    return;
};

export const resetPassword = async (token: string, newPassword: string) => {
    let payload: ResetTokenPayload;

    try {
        payload = verifyToken<ResetTokenPayload>(token);
    } catch (err) {
        throw new BadRequestError("Invalid or expired token");
    }

    if (payload.purpose !== "reset-password") {
        throw new BadRequestError("Invalid token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
        throw new BadRequestError("Invalid or expired token");
    }

    // If the password already changed since this token was issued,
    // the embedded hash won't match — token is stale/already used
    if (user.password !== payload.pwdHash) {
        throw new BadRequestError("Invalid or expired token");
    }

    const hashedPassword = await bycrpt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return;
};