import express from "express"
import {NotificationSettingController} from "../controllers/notificationSetting.controller"
module.exports = app => {
  const router = express.Router()
  const NotificationSetting = new NotificationSettingController()
  router.post(
    "/createNotificationSetting",
    NotificationSetting.createNotificationSetting
  )

  router.get(
    "/fetchNotificationByStoreFk/:storeFk",
    NotificationSetting.fetchNotificationSettingByStoreFk
  )

  router.get(
    "/fetchNotificationSettingByStoreFkNotNull",
    NotificationSetting.fetchNotificationSettingByStoreFkNotNull
  )

  router.delete(
    "/deleteNotificationSetting/:id",
    NotificationSetting.deleteNotificationSetting
  )

  router.get(
    "/fetchNotificationSettingById/:id",
    NotificationSetting.fetchNotificationSettingById
  )

  app.use("/api/notificationSetting", router)
}
