import bycrpt from "bcrypt";
import { prisma } from "../config/db";
import jwt from "jsonwebtoken";
import { env } from '../config/env';
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/mailer";


export const signup = async (data: any) => {
    // const { firstName, lastName, email, password } = data;
    const { firstName, lastName, email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("Email already exists.");
    }

    const hashedPassword = await bycrpt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
    })

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,

    }
}

export const login = async (data: any) => {

    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {

        throw new Error("User not found.");

    }

    const isPasswordValid = await bycrpt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid Password.")
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        env.JWT_SECRET as string,
        { expiresIn: "7d" }
    )

    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

    }
}

const hashToken = (token: string) =>
    crypto.createHash("sha256").update(token).digest("hex");


export const forgetPassword = async (email: any) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
        data: {
            token: hashedToken,
            expiresAt,
            userId: user.id,
        },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    // Nothing sensitive returned to the caller — token only goes out via email
    return;
};


export const resetPassword = async (rawToken: string, newPassword: string) => {
    const hashedToken = hashToken(rawToken);

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: hashedToken },
    });

    if (!resetToken) {
        throw new Error("Invalid or expired token");
    }

    if (resetToken.expiresAt < new Date()) {
        // clean up expired token
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
        throw new Error("Invalid or expired token");
    }

    const hashedPassword = await bycrpt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
    });

    // Invalidate the token so it can't be reused
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return;
}