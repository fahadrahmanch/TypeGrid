import cron from "node-cron";
import logger from "../../utils/logger";
import { UserSubscription } from "../db/models/user/user.subscription.schema";
import { Company } from "../db/models/company/company.schema";

// Runs every day at midnight
export const checkSubscriptionCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      const userRes = await UserSubscription.updateMany(
        {
          endDate: { $lt: now },
          status: "active",
        },
        {
          $set: { status: "expired" },
        }
      );

      const companyRes = await Company.updateMany(
        {
          endDate: { $lt: now },
          status: "active",
        },
        {
          $set: { status: "expired" },
        }
      );

      logger.info(
        `Subscription check cron completed: Expired ${userRes.modifiedCount} user subscription(s) and ${companyRes.modifiedCount} company subscription(s).`
      );
    } catch (error) {
      logger.error("Error executing subscription check cron job:", error);
    }
  });
};