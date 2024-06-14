import express from "express"
import {RackController} from "../controllers/rack.controller"
import controllerauth from "../controllers/AuthController"
//import passport from "passport"
module.exports = app => {
  var router = express.Router()
  const controller = new RackController()
  // Create a new Rack
  router.post(
    "/createRack/",
    controllerauth.authenticateJWT,
    controller.rackCreate
  )

  //Fetch Rack By Id
  router.get(
    "/fetchRackById/:id",

    controller.fetchRackById
  )

  // Update a Rack with id
  router.put("/:id", controller.update)

  // Delete a Rack with id
  router.delete("/:id", controller.deleteRack)

  //Seach Rack By rackName
  router.post("/searchRack", controller.searchRack)

  router.get("/:client_fk", controller.findAll)

  //Fetch Rack By ClientId
  router.get(
    "/fetchRackByClientId/:name/:client_fk",
    controller.fetchRackByClientId
  )

  // Create a new Tray
  router.post("/tray", controllerauth.authenticateJWT, controller.trayCreate)

  router.get("/tray/items/", controller.fetchTrays)

  // Retrieve a single Tray with id
  router.get("/tray/:id", controller.fetchTrayById)

  // Update a Tray with id
  router.put("/tray/:id", controller.updateTray)

  router.put("/tray/props/:trayId", controller.saveTrayLayout)

  // Delete a Tray with id
  router.delete("/tray/:id", controller.deleteTray)

  // Fetch a Tray prop By Rackid
  router.get("/traylisting/props/:rack_fk", controller.fetchTrayPropByRackId)

  // Fetch a Tray Data By Rackid
  router.get("/traylisting/data/:rack_fk", controller.fetchTrayDataByRackId)

  router.get("/fetchRackByStoreFk/:storeFk", controller.fetchRackByStoreFk)

  app.use("/api/rack", router)
}
