import items from "../controllers/elasticsearch.controller"
import express from "express"

module.exports = app => {
  var router = express.Router()

  // Create a new index
  router.post("/", items.createIndex)

  app.use("/es/index", router)
}
