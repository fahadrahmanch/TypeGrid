import Redis from "ioredis";
import logger from "../utils/logger";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (err) => {
  logger.error("Redis error", { error: err.message, stack: err.stack });
});

export default redis;
