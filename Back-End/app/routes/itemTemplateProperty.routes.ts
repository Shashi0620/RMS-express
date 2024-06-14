import express from "express"
import {ItemTemplatePropertyController} from "../controllers/itemTemplateProperty.controller"
module.exports = app => {
  const router = express.Router()
  const controller = new ItemTemplatePropertyController()
  // Create a new Template property
  router.post("/", controller.create)

  // Retrieve all Template property
  router.get("/", controller.findAll)

  // Update a Template property  with id
  router.put("/:id", controller.update)

  // Delete a Template property  with id
  router.delete("/:id", controller.deleteTempProp)

  app.use("/api/itemProperties", router)
}
