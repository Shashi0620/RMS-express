import db from "../models"
const notifications = db.notifications
import {Request, Response} from "express"
import {Req, Res} from "routing-controllers"
export class UserNotification {
  public async saveNotification(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const notification = {
      notificationType: req.notificationType,
      email: req.email,
      status: req.status,
      userFk: req.userFk,
      noOfRetry: req.noOfRetry
    }
    // Save Tutorial in the database
    const data = await notifications.create(notification)
    try {
      res.send(data)
    } catch (error) {
      error
    }
  }
}
