import passport from "passport"
import db from "../models"
import passportLocal from "passport-local"
import passportJwt from "passport-jwt"
const logger = require("pino")()
const localStrategy = passportLocal.Strategy
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt
const User = db.user
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = "wowwow"
passport.use(
  new localStrategy({usernameField: "username"}, (username, password, done) => {
    User.findOne({username: username.toLowerCase()}, function (err, user) {
      if (err) {
        logger.error("error in finding the user" + err)
      }
      if (!user) {
        return done(undefined, false, {
          message: `username ${username} not found.`
        })
      }
      user.comparePassword(password, function (err: Error, isMatch: boolean) {
        if (err) {
          logger.error("cannot find the password" + err)
        }
        if (isMatch) {
          return done(user)
        }
        return done(undefined, false, {
          message: "Invalid username or password."
        })
      })
    })
  })
)
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  logger.info("payload received", jwt_payload)
  const user = User.findOne({username: jwt_payload.username})
  if (user) {
    next(null, user)
  } else {
    next(null, false)
  }
})
passport.use(strategy)
