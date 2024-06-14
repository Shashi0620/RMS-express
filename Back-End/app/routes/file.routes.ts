import express from "express"
import {FileDownLoadController} from "../controllers/fileDownload.controller"
module.exports = app => {
  var router = express.Router()
  const controller = new FileDownLoadController()
  // Create a new Tutorial
  router.post("/", controller.fileCreate)

  router.get("/fetchFileById/:user_fk", controller.findOne)

  router.put("/updateFile/:id", controller.updateFile)

  router.get("/fetchTrayFile/", controller.fetchTrayFile)

  router.put("/updateTrayByFile/:tray_fk", controller.updateTrayByFile)

  app.use("/api/file", router)
}
