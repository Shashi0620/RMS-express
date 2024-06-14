import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import crypto from "crypto"
import {UserNotification} from "../middleware/userNotification"
const logger = require("pino")()
const profile = db.userprofile
db.Sequelize = Sequelize
import {Request, Response} from "express"
import {Body, Get, JsonController, Put, Req, Res} from "routing-controllers"
import {Service} from "typedi"
import Query from "mysql2/typings/mysql/lib/protocol/sequences/Query"
@JsonController("/api/profile")
@Service()
export class UserProfilesController {
  userNotification: UserNotification = new UserNotification()
  @Put("/:id")
  public async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any
  ): Promise<void> {
    const id = req.params.id
    const num = await profile.update(body, {
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Profile was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Profile with id=${id}.`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Profile with id=" + err
      })
    }
  }
  @Get("/fetchProfileById/:id")
  public async fetchProfileById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await profile.findByPk(id)
    try {
      res.send(data)
      logger.info(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving profile with id=" + err
      })
    }
  }
  @Get("/fetchProfileByUserFK/:user_fk")
  public async fetchProfileByUserFK(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const user_fk = req.params.user_fk
    const data = await profile.findAll(
      {where: {user_fk: user_fk}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving userProfile with id=" + err
      })
    }
  }
  @Get("/fetchAllProfiles")
  public async fetchAllProfiles(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const data = await profile.findAll()
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving userProfile" + err
      })
    }
  }
  @Put("/updatePassword/:user_fk")
  public async updatePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const user_fk = req.params.user_fk
    const profile = {
      password: body.password,
      confirmPassword: body.confirmPassword,
      email: body.email
    }
    var hash = crypto.createHash("md5").update(profile.password).digest("hex")
    profile.password = hash
    let query = `UPDATE userprofiles SET password = '${profile.password}' WHERE user_fk = ${user_fk}`
    await sequelizeConfig.query(query, {type: QueryTypes.UPDATE})
    try {
      await this.updateUserPassword(
        profile.password,
        user_fk,
        profile.email,
        res
      )
      logger.info("updated successfully")
    } catch (err) {
      res.status(500).send({
        message: "Error updating Form with id=" + err
      })
    }
  }

  // Delete a Staff with the specified id in the request
  public async deleteProfile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const user_fk = req.params.user_fk
    const num = await profile.destroy({
      where: {user_fk: user_fk}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Profile was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Template with id=${user_fk}. Maybe Template was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Template with id=" + err
      })
    }
  }
  public async updateUserPassword(password, id, email, res): Promise<void> {
    let query = `UPDATE users SET password = '${password}' WHERE id = ${id}`
    await sequelizeConfig.query(query, {type: QueryTypes.UPDATE})
    try {
      const data = await this.createNotification({id, email})
      res.send(data)
    } catch (err) {
      logger.error("Error updating user password with id" + err)
    }
  }

  public async createNotification({
    id,
    email
  }: {
    id: number
    email: string
  }): Promise<void> {
    var notification = {
      notificationType: "",
      email: "",
      status: "",
      userFk: 0,
      noOfRetry: 0
    }
    ;(notification.notificationType = "CHANGEPASSWORD"),
      (notification.email = email),
      (notification.status = "NEW"),
      (notification.userFk = id),
      (notification.noOfRetry = 3),
      await this.userNotification.saveNotification(notification)
  }
}
