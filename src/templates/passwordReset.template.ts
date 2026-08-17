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

        <a href="${resetLink}">
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