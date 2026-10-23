import { escapeHtml } from "../utils/escapeHtml";

export const verifyEmailTemplate = (verifyLink: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Verify Your Email</h2>

        <p>
          Thanks for signing up! Please confirm your email address to activate your account.
        </p>

        <p>
          Click the button below to verify your email:
        </p>

        <a href="${escapeHtml(verifyLink)}">
          Verify Email
        </a>

        <p>
          This link will expire in 24 hours.
        </p>

        <p>
          If you did not create an account, you can safely ignore this email.
        </p>
      </body>
    </html>
  `;
};

export const passwordResetTemplate = (resetLink: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Reset Your Password</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to reset your password:
        </p>

        <a href="${escapeHtml(resetLink)}">
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </body>
    </html>
  `;
};
