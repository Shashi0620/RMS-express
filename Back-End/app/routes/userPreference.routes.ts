import express from "express"
import {UserPreferenceController} from "../controllers/userPreference.controller"
module.exports = app => {
  const router = express.Router()
  const userPreferenceController = new UserPreferenceController()
  router.post(
    "/createUserPreference",
    userPreferenceController.createUserPreference
  )

  router.get(
    "/fetchAllSelectedColumns/:templateId/:userFk",
    userPreferenceController.fetchAllSelectedColumns
  )

  router.put("/:id", userPreferenceController.updateSelectedColumns)

  app.use("/api/userPreference", router)
}
