export const SALT_ROUNDS = 10;
export const AUTH_TOKEN_EXPIRY = "7d";
// export const ADMIN_TOKEN_EXPIRY = "1d";
export const RESET_TOKEN_EXPIRY = "15m"; //For reset password token
export const VERIFY_EMAIL_TOKEN_EXPIRY = "24h"; //For email verification token
export const FREE_READ_LIMIT = 3;
export const PREVIEW_RATIO = 0.4; // roughly how much content a non-logged-in visitor sees
export const ACTIVE_STATUSES = ["active", "trialing"];

// Cron
export const DIGEST_CRON = " 30 20 * * *"; // 12:00 AM every day
export const DIGEST_TIMEZONE = "Asia/Karachi";