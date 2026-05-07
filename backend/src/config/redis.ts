import Redis from "ioredis";
import logger from "../utils/logger";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  // username: "default",
});

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (err) => {
  logger.error("Redis error", { error: err.message, stack: err.stack });
});

export default redis;
