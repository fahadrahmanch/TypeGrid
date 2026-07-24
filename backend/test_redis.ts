import "dotenv/config";
import redis from "./src/config/redis";

redis.on("error", (err) => {
  console.error("REDIS ERROR IN SCRIPT:", err);
  process.exit(1);
});

redis.on("connect", () => {
  console.log("REDIS CONNECTED IN SCRIPT");
  process.exit(0);
});
