import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { blogDigestQueue, scheduleDailyBlogDigest } from './queues/blogDigest.queue';
import { startBlogDigestWorker } from './workers/blogDigest.worker';

const PORT = env.PORT;

async function startServer() {
    await connectDB();

   const server = app.listen(PORT, (error?: Error) => {
    if (error) {
        console.error(`Failed to start server on port ${PORT}:`, error.message);
        process.exit(1);
    }

    console.log(`Server running on port ${PORT}`);
});

    // Background jobs start after the server is listening, so a Redis outage never blocks the API
    const worker = startBlogDigestWorker();

    scheduleDailyBlogDigest().catch((error) => {
        console.error("Failed to schedule the daily blog digest:", error);
    });

    // Finish in-flight jobs before exiting
    const shutdown = async () => {
        server.close();
        await worker.close();
        await blogDigestQueue.close();
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

startServer();
