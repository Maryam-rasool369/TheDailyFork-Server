import express, { Request, Response, Application } from 'express';
import { env } from './config/env';
import { connectDB } from './config/db';

import { prisma } from "./config/db";

const app: Application = express();
const PORT = env.PORT;

app.use(express.json());



async function testDatabase() {
  const users = await prisma.user.findMany();

  console.log(users);
}

testDatabase();

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();