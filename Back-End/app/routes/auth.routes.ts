import userNotification from "../middleware"
import {signup, signin} from "../controllers/auth.controller"
import verifySignUp from "../middleware"
import express from "express"
module.exports = app => {
  var router = express.Router()
  router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  router.post(
    "/api/auth/signup",
    //   [verifySignUp.checkDuplicateUsernameOrEmail],
    signup
  )

  // router.post('/api/user/notification', [userNotification.saveNotification])

  router.post("/api/auth/signin", signin)
  app.use(router)
}
