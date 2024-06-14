import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {NotificationControllers} from "../controllers/notification.controller"
const Escalation = db.escalation
import {Request, Response} from "express"
import {Req, Res} from "routing-controllers"
db.Sequelize = Sequelize
import {Service} from "typedi"
@Service()
export class EscalationController {
  notificationController: NotificationControllers =
    new NotificationControllers()
  public async createEscalation(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const escalation = {
      escalationType: req.body.escalationType,
      noOfRemainder: req.body.noOfRemainder,
      timeToEscalate: req.body.timeToEscalate,
      to: req.body.to,
      notificationSettngFk: req.body.notificationSettngFk
    }
    // Save Escalation in the database
    const data = await Escalation.create(escalation)
    try {
      res.send(data)
    } catch (e) {
      res.status(500).send({
        message: "Some error occurred while creating the escalation."
      })
    }
  }
  public async fetchEscalationByNotificationId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const notificationSettngFk = req.params.notificationSettngFk
    const notification = req.body.notification
    const notificationToEscalation = {
      notification: {escalation: {}}
    }
    notificationToEscalation.notification = notification.dataValues
    const data = await Escalation.findAll(
      {
        where: {
          notificationSettngFk: notificationSettngFk
        }
      },
      QueryTypes.SELECT
    )
    try {
      notificationToEscalation.notification.escalation = data
      res.send(notificationToEscalation)
    } catch (e) {
      res.status(500).send({
        message: "Error retrieving NotificationId" + e
      })
    }
  }
  public async fetchByNotificationId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const notificationSettngFk = req.params.notificationSettngFk
    const userFk = req.params.userFk
    const data = await Escalation.findAll(
      {
        where: {
          notificationSettngFk: notificationSettngFk
        }
      },
      QueryTypes.SELECT
    )
    try {
      data.forEach(escalation => {
        req.body.email = escalation.to
        req.body.status = "NEW"
        req.body.noOfRetry = 3
        req.body.userFk = userFk
        this.notificationController.createNotification(req, res)
      })
    } catch (error) {
      res.status(500).send({
        message: "Error retrieving NotificationId in  escalation Table " + error
      })
    }
  }
  public async deleteEscalationByNotificationId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const notificationSettngFk = req.params.notificationSettngFk

    const num = await Escalation.destroy({
      where: {
        notificationSettngFk: notificationSettngFk
      }
    })
    try {
      if (num == 1) {
        res.send({
          message: "Escalation was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Escalation with id=${notificationSettngFk}. Maybe Escalation was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Escalation with id=" + err
      })
    }
  }
}
