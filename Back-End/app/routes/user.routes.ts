// import {Router} from "express"
// import {UserController} from "../controllers/user.controller"
// const router = Router()
// const passport = require("passport")
// module.exports = function (app) {
//   const controller = new UserController()
//   router.post("/client", controller.createClient)

//   // Create a new Rack
//   router.post("/", controller.Create)

//   router.post("/login", controller.login)

//   app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
//     next()
//   })
//   //export default router
//   router.get("/api/test/all", controller.allAccess)
//   router.get("/client/staff/role", controller.getRole)
//   router.post("/client/staff/save/:clientName", controller.saveClientStaff)
//   router.get("/client/staff", controller.getClientStaffList)
//   router.get("/client/name", controller.getClientNameByID)
//   router.get("/client/staff/:id", controller.findOne)
//   router.put("/client/staff/update/:id", controller.update)
//   router.post("/client/resetPassword/", controller.forgotpassword)
//   router.get("/client/validation/:value/:type", controller.validation)
//   router.delete("/client/staff/delete/:id", controller.deleteStaff)
//   router.get("/client/plans", controller.findAllPlans)
//   router.get("/activation/:clientPK/:userPk", controller.updateUserStatus)
//   router.get("/role", controller.getRoleNameByID)
//   router.get("/client/validation/:value/:type", controller.validations)
//   router.get("/plan", controller.getPlan)
//   router.get("/client/fetchdata/:clientId", controller.getClient)
//   router.put("/updateUserElasticSearchUrl/:userPk", controller.updateUserElasticSearchUrl)

//   app.use("/api/user", router)
// }
