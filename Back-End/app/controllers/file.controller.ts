/* eslint-disable @typescript-eslint/explicit-function-return-type */
import uploadFile from "../middleware/upload"
import fs from "fs"
const baseUrl = "http://localhost:8080/files/"
const baseUrlProfile = "http://localhost:8080/files/profile/"
import {Request, Response} from "express"
import {Get, JsonController, Post, Req, Res} from "routing-controllers"
import {Service} from "typedi"
import * as path from "path"
const logger = require("pino")()
@Service()
@JsonController("")
export class FileController {
  @Post("/")
  public async upload(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    try {
      await uploadFile(req, res)
      if (req.file) {
        res.send({
          message: "Uploaded the file successfully:" + req.file.originalname
        })
      }
    } catch (error) {
      error

      if (error == "LIMIT_FILE_SIZE") {
        logger.error("File size cannot be larger than 2MB!" + error)
      }

      logger.error(
        `Could not upload the file: ${req.file.originalname}. ${error}`
      )
    }
  }
  @Get("/files")
  public async getListFiles(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const directoryPath =
      global.__basedir + "\\resources\\static\\assets\\uploads\\profile"

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        // res.status(500).send({
        //   message: "Unable to scan files!" + err
        // })
        err
      }

      const fileInfos = []

      files.forEach(file => {
        fileInfos.push({
          fileName: file,
          filePath: baseUrl + file
        })
      })

      res.send(fileInfos)
    })
  }
  @Get("/files/profile")
  public async getListFilesInProfile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    let fileInfos = []
    const directoryPath =
      global.__basedir + "\\resources\\static\\assets\\uploads\\profile\\"
    const files = fs.readdirSync(directoryPath)
    files.forEach(file => {
      fileInfos.push({
        fileName: file,
        filePath: baseUrlProfile + file
      })
    })
    res.send(fileInfos)
  }
  @Get("/files/:name")
  public async download(
    @Req() req: Request,
    @Res() response: Response
  ): Promise<void> {
    const fileName = req.params.name
    const directoryPath =
      global.__basedir + "\\resources\\static\\assets\\uploads\\profile\\"
    const filePath = directoryPath + fileName
    try {
      await new Promise((resolve, reject) => {
        response.sendFile(filePath, err => {
          if (err) reject(err)
          resolve()
        })
      })
    } catch (error) {
      logger.log(error)
    }

    return
  }
  @Get("/files/profile/:name")
  public async downloadProfileImages(
    @Req() req: Request,
    @Res() response: Response
  ) {
    const fileName = req.params.name
    const directoryPath =
      global.__basedir + "\\resources\\static\\assets\\uploads\\profile\\"
    const filePath = directoryPath + fileName
    try {
      await new Promise((resolve, reject) => {
        response.sendFile(filePath, err => {
          if (err) reject(err)
          resolve()
        })
      })
    } catch (error) {
      logger.log(error)
    }

    return
  }
}
