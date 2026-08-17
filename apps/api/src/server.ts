import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./common/logger.js";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`RS Flow API listening on http://localhost:${env.PORT}`);
});
