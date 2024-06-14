// import express from "express"
// import {storeController} from "../controllers/store.controller"
// import controllerauth from "../controllers/AuthController"
// module.exports = app => {
//   var router = express.Router()
//   const storeControllers = new storeController()
//   // Create a new Store
//   router.post("/createStore", storeControllers.create)

//   // Retrieve all Stores
//   router.get(
//     "/fetchStoreById/:storeId",
//     //passport.authenticate("jwt", {session: false}),
//     storeControllers.fetchStoreById
//   )

//   router.get(
//     "/fetchAllStoresByClientFK/:client_fk",

//     storeControllers.fetchAllStoresByClientFK
//   )

//   // Update Store By Id
//   router.put(
//     "/updateById/:storeId",
//     // controllerauth.authenticateJWT,
//     storeControllers.update
//   )

//   // Delete Store By Id
//   router.delete(
//     "/:storeId",
//     controllerauth.authenticateJWT,
//     storeControllers.storeDelete
//   )
//   app.use("/api/store", router)
// }
