/* eslint-disable no-extra-semi */
import db from "../models"
import Sequelize, {Op, QueryTypes} from "sequelize"
import {EscalationController} from "../controllers/escalation.controller"
const NotificationSettings = db.notificationSettings
db.Sequelize = Sequelize
import {Request, Response} from "express"
import {
  Body,
  Delete,
  Get,
  JsonController,
  Post,
  Req,
  Res
} from "routing-controllers"
import {Service} from "typedi"
@Service()
@JsonController("/api/notificationSetting")
export class NotificationSettingController {
  escalationController: EscalationController = new EscalationController()
  @Post("/createNotificationSetting")
  public async createNotificationSetting(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const notificationSettings = {
      settingName: body.settingName,
      notificationType: body.notificationType,
      isEscalationRequired: body.isEscalationRequired,
      noOfRemainder: body.noOfRemainder,
      timeToEscalate: body.timeToEscalate,
      escalationType: body.escalationType,
      to: body.to,
      storeFk: body.storeFk
    }
    // Save Notification in the database
    const data = await NotificationSettings.create(notificationSettings)
    try {
      ;(req.body.escalationType = notificationSettings.escalationType),
        (req.body.noOfRemainder = notificationSettings.noOfRemainder),
        (req.body.timeToEscalate = notificationSettings.timeToEscalate),
        (req.body.to = notificationSettings.to),
        (req.body.notificationSettngFk = data.id),
        this.escalationController.createEscalation(req, res)
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Notification." + err
      })
    }
  }
  @Get("/fetchNotificationSettingById/:id")
  public async fetchNotificationSettingById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await NotificationSettings.findByPk(
      {where: {id: id}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Notification with id=" + err
      })
    }
  }
  @Delete("/deleteNotificationSetting/:id")
  public async deleteNotificationSetting(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const num = await NotificationSettings.destroy({
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Notification was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Store with id=" + err
      })
    }
  }
  @Get("/fetchNotificationByStoreFk/:storeFk")
  public async fetchNotificationSettingByStoreFk(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const storeFk = req.params.storeFk
    const data = await NotificationSettings.findAll(
      {where: {storeFk: storeFk}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving notifications" + err
      })
    }
  }
  @Get("/fetchNotificationSettingByStoreFkNotNull")
  public async fetchNotificationSettingByStoreFkNotNull(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const data = await NotificationSettings.findAll(
      {where: {storeFk: {[Op.not]: null}}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving notifications" + err
      })
    }
  }
}
