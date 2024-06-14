import db from "../models/index"
import Sequelize, {Op, QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import fileOp from "fs"
const files = db.files
const logger = require("pino")()
db.Sequelize = Sequelize
const baseUrl = "http://localhost:8080/api/fileUpload/files/profile/"
const directoryPath =
  global.__basedir + "\\resources\\static\\assets\\uploads\\profile\\"
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
@JsonController("/api/file")
export class FileDownLoadController {
  @Post("/postFile")
  public async fileCreate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const filePath = baseUrl + body.fileName
    body.filePath = filePath
    const file = {
      filename: body.fileName,
      filepath: body.filePath,
      user_fk: body.user_fk
    }
    // Save File in the database
    fileOp.copyFile(
      directoryPath + file.filename,
      directoryPath + file.filename,
      err => {
        if (err) {
          logger.error("file not copied" + err)
        }
      }
    )
    const data = await files.create(file)
    try {
      res.send(data)
    } catch (err) {
      err
    }
  }

  @Get("/fetchFileById/:user_fk")
  public async findOne(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const user_fk = req.params.user_fk
    const data = await files.findAll(
      {where: {user_fk: user_fk}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      err
    }
  }

  @Put("/updateFile/:id")
  public async updateFile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const uploadedFile = body.fileName
    const id = req.params.id
    const file = {
      filename: body.fileName,
      filepath: uploadedFile
    }

    let query = `UPDATE files SET filepath = '${file.filepath}',filename = '${file.filename}' WHERE id = ${id}`
    const data = await sequelizeConfig.query(query)
    try {
      if (data[1].rowCount > 0) {
        fileOp.copyFile(
          directoryPath + file.filename,
          directoryPath + "/profile/" + file.filename,
          err => {
            if (err) logger.error("file copied")
          }
        )
        res.send({
          message: "profile password was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update profile password id=${id}`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Form with id=" + err
      })
    }
  }
  @Get("/fetchTrayFile/")
  public async fetchTrayFile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const data = await files.findAll(
      {where: {tray_fk: {[Op.not]: null}}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving while fetching File with tray_fk=" + err
      })
    }
  }
  @Put("/updateTrayByFile/:tray_fk")
  public async updateTrayByFile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const directoryPath = baseUrl + req.body.filename
    const tray_fk = req.params.tray_fk
    const file = {
      filename: req.body.filename,
      filepath: directoryPath
    }
    let query = `UPDATE files SET filepath = '${file.filepath}' WHERE tray_fk = ${tray_fk}`
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.UPDATE
    })
    try {
      if (data[1].rowCount > 0) {
        res.send({
          message: "profile password was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update profile password tray_fk=${tray_fk}`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Form with tray_fk=" + err
      })
    }
  }
}
