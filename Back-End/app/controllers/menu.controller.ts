import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import {UserController} from "./user.controller"
import "reflect-metadata"
const logger = require("pino")()
const Menu = db.menus
db.sequelize = sequelizeConfig
db.Sequelize = Sequelize
import {Request, Response} from "express"
import {
  Get,
  JsonController,
  Post,
  QueryParam,
  Req,
  Res
} from "routing-controllers"
import {Service} from "typedi"
@Service()
@JsonController("/api/menu")
export class MenuController {
  @Post("/createMenu")
  public async menuCreate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const menu = {
      label: req.query.label,
      action: req.query.action,
      menu_fk: req.query.menu_fk,
      roleId: req.query.roleId,
      templateID: req.query.templateID,
      clientFk: req.query.clientFk
    }

    // Save Rack in the database
    const data = await Menu.create(menu)
    logger.info(data, "created")
    res.send(data)
  }
  @Get("/item/:itemId")
  public async findMenuByItemId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.itemId
    const data = await Menu.findByPk(id)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + err
      })
    }
  }
  @Get("/")
  public async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParam("clientFk") clientFk: number,
    @QueryParam("roleId") roleId: number
  ): Promise<void> {
    const roleName = await UserController.getRoleName(roleId)
    let query = `SELECT * FROM menus WHERE "clientFk" IS NULL OR "clientFk" = ${clientFk}`
    if (roleName === "Staff") {
      query = `SELECT * FROM menus  WHERE "clientFk" =${clientFk}  OR "label"='Staff' `
    }
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    try {
      res.send(data)
    } catch (err) {
      res.status(500).json("error in finding the roleName")
    }
  }

  public async deletemenu(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const templateID = req.params.templateID
    await Menu.destroy({
      where: {templateID: templateID}
    })

    try {
      res.status(200).send({
        message: " deleted"
      })
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + err
      })
    }
  }

  // Update a Meny by the id in the request

  public async update(@Req() req: Request): Promise<void> {
    const id = req.params.id
    Menu.update(req.body, {
      where: {id: id}
    })
  }

  @Get("/fetchMenu/")
  public async findById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const templateID = req.query.templateID
    const data = await Menu.findAll({
      where: {templateID: templateID}
    })
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with templateID=" + err
      })
    }
  }
}
