import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Node.js + TypeScript Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
