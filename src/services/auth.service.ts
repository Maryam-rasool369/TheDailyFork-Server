import { UnauthorizedError, BadRequestError } from "../utils/errors";
import { SignupInput, LoginInput } from "../validations/auth.validation";
import { User } from "../generated/client";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { sendEmail } from "../services/email.service";
import { passwordResetTemplate } from "../templates/passwordReset.template";
import { generateAuthToken, generateResetToken, ResetTokenPayload, verifyToken } from "../utils/jwtHandler";
import { comparePassword, hashPassword } from "../utils/password";

export const signup = async (data: SignupInput) => {

    const hashedPassword = await hashPassword(data.password);

    const userRole = await prisma.role.upsert({  // it was not recommended to make a middleware 
        where: {
            name: "USER",
        },
        update: {},
        create: {
            name: "USER",
        },
    });

    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
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

    const isPasswordValid = await comparePassword(password, user.password);
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
    const user = await prisma.user.findUnique({ // move this to repository folder later 
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

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return;
};