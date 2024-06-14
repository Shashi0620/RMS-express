import db from "../models"
import Sequelize, {Op, QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import {Request, Response} from "express"
import {Service} from "typedi"
import config from "../configemail.json"
import {
  Body,
  Delete,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res
} from "routing-controllers"
import emailConfig from "../config/email.config"
const logger = require("pino")()
const Notification = db.notifications
db.Sequelize = Sequelize

@Service()
@JsonController("/api/notification")
export class NotificationControllers {
  @Post("/createNotification")
  public async createNotification(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const notification = {
      notificationType: req.body.notificationType,
      email: req.body.email,
      status: req.body.status,
      content: req.body.content,
      noOfRetry: req.body.noOfRetry,
      userFk: req.body.userFk
    }
    // Save Notification in the database
    const data = await Notification.create(notification)
    try {
      res.send(data)
    } catch (err) {
      err
    }
  }
  @Get("/fetchNotificationById/:id")
  public async fetchNotificationById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await Notification.findOne({
      where: {id: id}
    })
    try {
      res.send(data)
    } catch (err) {
      err
    }
  }
  @Put("/updateNotification/:id")
  public async updateNotification(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id
    const num = await Notification.update(body, {
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Template with id=${id}. Maybe Template was not found or req.body is empty!`
        })
      }
    } catch (err) {
      err
    }
  }
  @Delete("/deleteNotification/:id")
  public async deleteNotification(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const num = await Notification.destroy({
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
  @Get("/fetchAllNotification")
  public async fetchAllNotification(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const data = await Notification.findAll({
      where: {
        status: {
          [Op.notLike]: "%SENT%"
        }
      }
    })
    try {
      res.send(data)
      this.sendNotificationBasedOnStatus(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving notifications" + err
      })
    }
  }
  @Get("/fetchNotificationByUserFk/:userFk")
  public async fetchNotificationByUserFk(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userFk = req.params.userFk
    const data = await Notification.findAll(
      {where: {userFk: userFk}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      err
    }
  }

  public async sendNotificationBasedOnStatus(data): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < data.length; i++) {
      let email = data[i].email
      const message = {
        from: config.fromEmailAddress,
        to: email,
        subject: config.registrationEmailSubject,
        template: "sendNotificationStatus"
      }
      emailConfig.sendMail(message, (error): void => {
        this.updateNotificationStatus(error, data)
      })
    }
  }
  public async updateNotificationStatus(error, data): Promise<void> {
    let query: string
    if (error) {
      query = `UPDATE  notifications  SET "status"='RETRY', "noOfRetry" = "noOfRetry"-1 WHERE "userFk"=${data.id}`
      logger.error("mail has not sent.")
    } else {
      query = `UPDATE notifications SET "status" = 'SENT' WHERE "userFk" = ${data.id}`
      logger.info("mail has sent.")
    }
    await sequelizeConfig.query(query, {
      type: QueryTypes.UPDATE
    })
  }
}
