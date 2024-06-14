export const JWT_SECRET = "ThisIsMySecret"
const logger = require("pino")()
if (!JWT_SECRET) {
  logger.log("No JWT secret string. Set JWT_SECRET environment variable.")
  process.exit(1)
}
