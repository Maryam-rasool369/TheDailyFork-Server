import express, { Application } from 'express';
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.route';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

// Rate limit auth routes — prevent brute force/spam
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per IP per window
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
});

app.use("/api/auth", authLimiter, authRouter);

// Global error handler — MUST be registered last, after all routes
app.use(errorHandler);

export default app;