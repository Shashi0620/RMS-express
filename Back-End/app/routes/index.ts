import express from "express"
import {FileController} from "../controllers/file.controller"
var router = express.Router()
module.exports = app => {
  const controller = new FileController()
  router.post("/upload", controller.upload)
  router.get("/files", controller.getListFiles)
  router.get("/files/profile", controller.getListFilesInProfile)
  router.get("/files/:name", controller.download)
  router.get("/files/profile/:name", controller.downloadProfileImages)
  app.use(router)
}
