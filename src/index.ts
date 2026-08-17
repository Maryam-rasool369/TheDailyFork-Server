import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const PORT = env.PORT;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();