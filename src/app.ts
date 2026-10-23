import express, { Application } from 'express';
import cors from "cors";
import helmet from 'helmet';
import authRouter from './routes/auth.route';
import { errorHandler } from './middlewares/global/errorHandler';
import { authLimiter } from './middlewares/global/rateLimiter';
import blogRouter from "./routes/blog.route";
import categoryRouter from "./routes/category.route";
import profileRouter from "./routes/profile.route";
import stripeRouter from "./routes/stripe.route";
import adminRouter from "./routes/admin.route";


const app: Application = express();

app.use(helmet()); //use helmet for security headers so that 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
// app.use(express.json());
 
app.use((req, res, next) => {
    if (req.originalUrl === "/api/stripe/webhook") {
        return next(); // skip JSON parsing here — stripe.routes.ts applies raw() itself
    }
    express.json()(req, res, next);
});


app.use("/api/auth", authLimiter, authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/profile", profileRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;