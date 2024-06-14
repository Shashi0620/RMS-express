import express from "express"
import {FormController} from "../controllers/form.controller"
module.exports = app => {
  const router = express.Router()
  const controller = new FormController()
  // Create a new Form
  router.post("/", controller.create)

  // Retrieve all Form
  router.get("/", controller.findAll)

  router.get("/:prodId/:name", controller.findOne)

  router.get("/fetchAllTemplates/", controller.fetchAllTemplates)

  // Update a Form with id
  router.put("/:id/:name", controller.update)

  // Delete a Form with id
  router.delete("/:id/:name", controller.deleteForm)

  app.use("/api/form", router)
}
