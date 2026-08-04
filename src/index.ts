import express, { Request, Response, Application } from 'express';
import { env } from './config/env';
import { connectDB } from './config/db';

import { prisma } from "./config/db";
import authRouter from './routes/auth.route';

const app: Application = express();
const PORT = env.PORT;

app.use(express.json());

// auth 
app.use("/api/auth",authRouter)



async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();