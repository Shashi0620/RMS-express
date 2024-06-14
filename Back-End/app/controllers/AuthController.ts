import {NextFunction, Request, Response} from "express"
import passport from "passport"
import "../auth/passportHandler"
const logger = require("pino")()
function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate("jwt", function (err, user) {
    if (err) {
      logger.error("user not authenticateJWT" + err)
      return res.status(401).json({status: "error", code: "unauthorized"})
    }
    if (!user) {
      logger.debug("user Not authendicate" + user)
      return res.status(401).json({status: "error", code: "unauthorized"})
    } else {
      logger.info("User Authendicated")
      return next()
    }
  })(req, res, next)
}

const authorizeJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate("jwt", function (err, user, jwtToken) {
    if (err) {
      logger.error("User Not Authorized" + err)
      return res.status(401).json({status: "error", code: "unauthorized"})
    }
    if (!user) {
      return res.status(401).json({status: "error", code: "unauthorized"})
    } else {
      const scope = req.baseUrl.split("/").slice(-1)[0]
      const authScope = jwtToken.scope
      if (authScope && authScope.indexOf(scope) > -1) {
        logger.debug("User  Authorized" + user)
        return next()
      } else {
        return res.status(401).json({status: "error", code: "unauthorized"})
      }
    }
  })(req, res, next)
}

export default {authorizeJWT, authenticateJWT}
