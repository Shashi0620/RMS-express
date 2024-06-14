import {ItemController} from "../controllers/item.controller"
import express from "express"
module.exports = app => {
  var router = express.Router()
  const Itemcontroller = new ItemController()
  // Create a new Tutorial

  router.post("/", Itemcontroller.create)

  // Retrieve all Tutorialscls

  router.get("/", Itemcontroller.findAll)

  router.get("/:name/:id", Itemcontroller.findOne)

  router.get("/:id", Itemcontroller.findOne)

  // Update a Tutorial with id
  router.put("/:id/:name", Itemcontroller.updatetemp)

  // Delete a Tutorial with id
  router.delete("/:id/:name", Itemcontroller.deleteItem)

  router.get("/template/validate/:value", Itemcontroller.validation)

  app.use("/api/items", router)
}
