import express from "express"
import {MenuController} from "../controllers/menu.controller"
module.exports = app => {
  const controller = new MenuController()
  const router = express.Router()
  router.get("/item/:itemId", controller.findMenuByItemId)

  router.get("/", controller.findAll)

  router.post("/createMenu", controller.menuCreate)

  router.get("/fetchMenu/:templateID", controller.findById)

  app.use("/api/menu", router)
}
