import express from "express"
import {NotificationControllers} from "../controllers/notification.controller"
module.exports = app => {
  const router = express.Router()
  const controller = new NotificationControllers()
  router.get("/fetchAllNotification", controller.fetchAllNotification)

  router.get(
    "/fetchNotificationByUserFk/:userFk",
    controller.fetchNotificationByUserFk
  )

  router.post("/createNotification", controller.createNotification)

  router.get("/fetchNotificationById/:id", controller.fetchNotificationById)

  router.put("/updateNotification/:id", controller.updateNotification)

  router.delete("/deleteNotification/:id", controller.deleteNotification)

  app.use("/api/notification", router)
}
