import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
const UserPreference = db.userPreference
db.Sequelize = Sequelize
import {Request, Response} from "express"
import {
  Body,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res
} from "routing-controllers"
import {Service} from "typedi"
@Service()
@JsonController("/api/userPreference")
export class UserPreferenceController {
  @Post("/createUserPreference")
  public async createUserPreference(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userPreference = {
      selectedColumns: req.body.selectedColumns,
      templateId: req.body.templateId,
      userFk: req.body.userFk
    }
    // Save Rack in the database
    const data = await UserPreference.create(userPreference)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Rack." + err
      })
    }
  }
  @Put("/:id")
  public async updateSelectedColumns(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id
    const num = await sequelizeConfig.query(
      `UPDATE "userPreferences" SET "selectedColumns" = '${body.selectedColumns}' WHERE id = ${id} And "templateId" = ${body.templateId}`,
      {type: QueryTypes.UPDATE}
    )
    try {
      if (num == 1) {
        res.send({
          message: "trayItems was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update trayItems with id=${id}.`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Form with id=" + err
      })
    }
  }
  @Get("/fetchAllSelectedColumns/:templateId/:userFk")
  public async fetchAllSelectedColumns(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const templateId = req.params.templateId
    const userFk = req.params.userFk
    const data = await sequelizeConfig.query(
      `SELECT * FROM "userPreferences" where "templateId" = ${templateId} AND "userFk" = ${userFk}`,
      {
        type: QueryTypes.SELECT
      }
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving selected columns" + err
      })
    }
  }
}
