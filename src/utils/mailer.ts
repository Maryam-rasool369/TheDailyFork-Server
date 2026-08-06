import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (to: string, link: string) => {
    await transporter.sendMail({
        from: `"Your Blog" <${env.SMTP_USER}>`,
        to,
        subject: "Reset your password",
        html: `
            <p>You requested a password reset.</p>
            <p>Click the link below to set a new password. This link expires in 15 minutes.</p>
            <a href="${link}">${link}</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
        `,
    });
};