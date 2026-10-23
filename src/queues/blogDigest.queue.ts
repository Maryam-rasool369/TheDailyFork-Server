import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";
import { DIGEST_CRON, DIGEST_TIMEZONE } from "../comman/constants";

export const BLOG_DIGEST_QUEUE = "blog-digest-queue";
// Jobs
export const JOB_NAMES = {
    BUILD_DIGEST: "build-digest",
    SEND_DIGEST_EMAIL: "send-digest-email",
} as const;

// Queue instance
export const blogDigestQueue = new Queue(BLOG_DIGEST_QUEUE, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 60_000 }, // retry after 1 min, then 2 min
        removeOnComplete: { age: 24 * 60 * 60, count: 1000 },
        removeOnFail: { age: 7 * 24 * 60 * 60 },
    },
})

blogDigestQueue.on("error", (err) => {
    console.error("Blog Digest Queue Error:", err);
})

//Scheduler
export const scheduleDailyBlogDigest = async () => {
    await blogDigestQueue.upsertJobScheduler(
        "daily-blog-digest",
        { pattern: DIGEST_CRON, tz: DIGEST_TIMEZONE },
        { name: JOB_NAMES.BUILD_DIGEST }
    );
};