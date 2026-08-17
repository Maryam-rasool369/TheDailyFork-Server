import express, { Application } from 'express';
import cors from "cors";
import helmet from 'helmet';
import authRouter from './routes/auth.route';
import { errorHandler } from './middlewares/errorHandler';
import { authLimiter } from './middlewares/rateLimiter';
import blogRouter from "./routes/blog.route";

const app: Application = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/blogs", blogRouter);

app.use(errorHandler);

export default app;