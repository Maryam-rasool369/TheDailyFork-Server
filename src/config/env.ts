import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,

    JWT_SECRET: process.env.JWT_SECRET!,
    // JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET!,

    // SMTP configuration
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: process.env.SMTP_PORT!,
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

    // Google GIS
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    STRIPE_PRICE_ID_MONTHLY: process.env.STRIPE_PRICE_ID_MONTHLY!,
    STRIPE_PRICE_ID_YEARLY: process.env.STRIPE_PRICE_ID_YEARLY!,
    
    // Redis connection
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: process.env.REDIS_PORT!,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
};
