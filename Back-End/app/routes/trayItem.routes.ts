import express from "express"
import {TrayItemController} from "../controllers/trayItem.controller"
module.exports = app => {
  const router = express.Router()
  const controller = new TrayItemController()
  router.post("/createTrayItem/", controller.trayItemCreate)

  router.put("/:id", controller.updateTrayItems)

  router.get("/findAllItems", controller.findAllItems)

  router.get("/fetchItem/:formId", controller.fetchItem)

  router.get(
    "/fetchTemplateAndTrayById/:tempId/:trayId",
    controller.fetchTemplateAndTrayById
  )

  router.get(
    "/fetchTrayTemplateAndFormById/:trayId/:tempId/:formId",
    controller.fetchTrayTemplateAndFormById
  )

  app.use("/api/trayItem", router)
}
