import { app } from ".";
import { initSocket } from "./infrastructure/socket/socket";
import http from "http";
import logger from "./utils/logger";

const application = new app();
async function startServer() {
  await application.connectDatabase();
  const PORT = process.env.PORT;
  const server = http.createServer(application.app);

  initSocket(server);

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}
startServer();

