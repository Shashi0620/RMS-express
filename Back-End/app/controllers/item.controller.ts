import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import {MenuController} from "./menu.controller"
import {FormController} from "./form.controller"
const logger = require("pino")()
db.sequelize = sequelizeConfig
db.Sequelize = Sequelize
import {Request, Response} from "express"
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
const Items = db.templates
import {Service} from "typedi"
@Service()
// Create and Save a new Template
@JsonController("/api/items")
export class ItemController {
  menucontroller: MenuController = new MenuController()
  formController: FormController = new FormController()
  @Post("")
  public async create(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    // Validate request
    var ites = JSON.stringify(req.query.attributes)

    const item = {
      attributes: ites,
      name: req.query.name,
      description: req.query.description,
      clientFk: req.query.clientFk
    }

    let query = `CREATE TABLE ${req.query.name}_template (`
    query += `id SERIAL PRIMARY KEY, name character varying(255),  itemTempId integer, description character varying(255), attributes json, createdAt timestamp with time zone NULL,
             updatedAt timestamp with time zone NULL, CONSTRAINT ${req.query.name}_fkey FOREIGN KEY (itemTempId)
             REFERENCES templates (id)
             ON UPDATE NO ACTION ON DELETE NO ACTION`
    query += ")"

    try {
      await sequelizeConfig.query(query)
      res.send("created")
    } catch (error) {
      logger.info("Error at  creating Templates" + error)
    }

    // Save Template in the database
    const data = await Items.create(item)
    try {
      var citemData = JSON.parse(data.dataValues.attributes)
      req.query.label = data.dataValues.name
      req.query.action =
        "menu" + "/" + data.dataValues.name + "/" + data.dataValues.id
      ;(req.query.roleId = 1),
        (req.query.menu_fk = 1),
        (req.query.templateID = data.dataValues.id)
      this.menucontroller.menuCreate(req, res)
      logger.info("created")
      citemData.forEach(function (citemData) {
        data.dataValues[citemData.name] = citemData.value
      })
      res.send(data)
    } catch (err) {
      logger.info("Error at saving templates in database")
    }
  }

  // Retrieve all Templates from the database.

  @Get("")
  public async findAll(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const clientFk = req.query.clientFk
    let query = ` SELECT * FROM templates `
    //clientFK will be 1 for SuperAdmin and >1 for admin
    if (clientFk > 1) {
      query = `${query} WHERE "clientFk" = ${clientFk}`
    }
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    try {
      res.send(data)
    } catch (error) {
      error
    }
  }

  // Update a Tutorial by the id in the request
  @Put("/:id/:name")
  public async updatetemp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id
    const tableName = req.params.name
    const menuId = req.query.menuId
    const updateTemplateName = body.name
    await sequelizeConfig.query(
      `ALTER TABLE ${tableName}_template
  RENAME TO ${updateTemplateName}_template;`,
      {type: QueryTypes.UPDATE}
    )
    const num = await Items.update(body, {
      where: {id: id}
    })
    try {
      if (num == 1) {
        req.params.id = menuId
        req.body.label = req.body.name
        req.body.action = "menu" + "/" + req.body.name + "/" + id
        this.menucontroller.update(req)
        res.send({
          message: "Template was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Template with id=${menuId}. Maybe Template was not found or req.body is empty!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Template with id=" + err
      })
    }
  }

  // Delete a Template with the specified id in the request
  @Delete("/:id/:name")
  public async deleteItem(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    req.params.templateID = req.params.id
    this.menucontroller.deletemenu(req, res)
    this.formController.deleteFromTemplate(req, res)
    const num = await Items.destroy({
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Template was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Template with id=${id}. Maybe Template was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Template with id=" + err
      })
    }
  }

  // Find a single Customer with a customerId
  @Get("/:id")
  public async findOne(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await Items.findByPk(id)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Template with id=" + err
      })
    }
  }
  @Get("/:name/:id")
  public async findOneTemplate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await Items.findByPk(id)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Template with id=" + err
      })
    }
  }
  public async fetchTemplateById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await Items.findByPk(id)
    try {
      req.params.formName = data.name
      this.formController.findTemplates(req, res)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Template with id=" + err
      })
    }
  }
  @Get("/template/validate/:value")
  public async validation(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const value = req.params.value
    const data = await Items.findAll({where: {name: value}}, QueryTypes.SELECT)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving users" + err
      })
    }
  }
}
