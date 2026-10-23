import { EmailAttachment } from "../comman/types";
import { env } from "../config/env";
import { transporter } from "../lib/mailer";


export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
    attachments?: EmailAttachment[]
) => {
    try {
        const info = await transporter.sendMail({
            from: `"Scribbly" <${env.SMTP_USER}>`,
            to,
            subject,
            html,
            ...(attachments?.length ? { attachments } : {}),
        });

        return info;
    } catch (error) {
        // console.error("Email sending failed:", error);
        throw new Error("Failed to send email. Please try again later.");
    }
};