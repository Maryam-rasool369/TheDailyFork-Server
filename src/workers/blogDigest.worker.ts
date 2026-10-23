import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { BLOG_DIGEST_QUEUE, JOB_NAMES } from "../queues/blogDigest.queue";
import { queueBlogDigest, sendBlogDigestEmail } from "../services/blogDigest.service";

export const startBlogDigestWorker = () => {
    const worker = new Worker(
        BLOG_DIGEST_QUEUE,
        async (job) => {
            switch (job.name) {
                case JOB_NAMES.BUILD_DIGEST:
                    return queueBlogDigest();
                case JOB_NAMES.SEND_DIGEST_EMAIL:
                    return sendBlogDigestEmail(job.data);
                default:
                    throw new Error(`Unknown job: ${job.name}`);
            }
        },
        {
            connection: redisConnection,
            concurrency: 5,
            limiter: { max: 10, duration: 1000 }, // at most 10 jobs per second, to stay within SMTP limits
        }
    );

    worker.on("failed", (job, error) => {
        console.error(`Job ${job?.name} (${job?.id}) failed:`, error.message);
    });

    worker.on("error", (error) => {
        console.error("Blog digest worker error:", error);
    });

    return worker;
};
