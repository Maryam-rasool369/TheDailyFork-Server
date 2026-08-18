import { BadRequestError } from "../utils/errors";
import { SignupInput } from "../validations/auth.validation";
import { User } from "../generated/client";
import { env } from "../config/env";
import { sendEmail } from "../services/email.service";
import { passwordResetTemplate } from "../templates/passwordReset.template";
import { generateAuthToken, generateResetToken, ResetTokenPayload, verifyToken } from "../utils/jwtHandler";
import { hashPassword, validatePassword } from "../utils/password";
import { createUser, findUserById, updateUserPassword } from "../repositories/user.repository";
import { getUserRole } from "../repositories/role.repository";


export const signup = async (
    data: SignupInput
) => {
    const { firstName, lastName, email, password } = data;
    const hashedPassword = await hashPassword(password);

    const role = await getUserRole();

    const user = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: role.id,
    });

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

    console.log("Email send result:", emailSendingInfo);
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

    const hashedPassword = await hashPassword(newPassword);

    await updateUserPassword(
        user.id,
        hashedPassword
    );
};