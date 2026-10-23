import { ConnectionOptions } from "bullmq";
import { env } from "./env";

export const redisConnection:ConnectionOptions = {
    host:env.REDIS_HOST,
    port:Number(env.REDIS_PORT),
    password:env.REDIS_PASSWORD || undefined,
}
