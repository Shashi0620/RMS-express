import express from "express"
import {UserProfilesController} from "../controllers/userProfile.controller"
module.exports = app => {
  const router = express.Router()
  const controller = new UserProfilesController()
  router.put("/:id", controller.updateProfile)

  router.get(
    "/fetchProfileByUserFK/:user_fk",

    controller.fetchProfileByUserFK
  )

  router.get(
    "/fetchProfileById/:id",

    controller.fetchProfileById
  )

  router.get(
    "/fetchAllProfiles",

    controller.fetchAllProfiles
  )

  router.put("/updatePassword/:user_fk", controller.updatePassword)

  app.use("/api/profile", router)
}
