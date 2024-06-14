import {ItemTemplateController} from "../controllers/itemTemplate.controller"
import express from "express"
module.exports = app => {
  const router = express.Router()
  const controller = new ItemTemplateController()
  router.post("/", controller.create)

  router.get("/", controller.findAll)

  router.put("/:id", controller.update)

  router.delete("/:id", controller.deleteItemTemplate)

  app.use("/api/itemTemplate", router)
}
