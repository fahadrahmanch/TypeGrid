import { app } from ".";
import { initSocket } from "./infrastructure/socket/socket";
import http from "http";
import logger from "./utils/logger";
import { checkSubscriptionCron } from "./infrastructure/cron/subcription-check.cron";
import { resetCompanyUserStats } from "./infrastructure/cron/company-user-stats-reset.cron";

const application = new app();
async function startServer() {
  await application.connectDatabase();
  checkSubscriptionCron();
  resetCompanyUserStats();
  const PORT = process.env.PORT;
  const server = http.createServer(application.app);

  initSocket(server);
  //
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}
startServer();
