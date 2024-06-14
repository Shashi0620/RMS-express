import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
const logger = require("pino")
db.sequelize = sequelizeConfig

db.Sequelize = Sequelize
const Item = db.Templates

// Create and Save a new Product
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
import {Service} from "typedi"
@Service()
@JsonController("/api/form")
export class FormController {
  @Post("/")
  public async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any
  ): Promise<void> {
    // const data =  JSON.stringify(req.body.itemData)
    const bodyAttribute = body.attributes
    var itemName = req.query.tempName
    var formData = JSON.stringify(bodyAttribute)
    const item = {
      attributes: formData,
      name: req.body.name,
      itemTempId: req.body.itemTempId,
      description: req.body.description
    }

    let insert = `INSERT INTO ${itemName}_template(`
    for (let key in item) {
      if (key === "description") {
        insert += `${key}`
      } else {
        insert += `${key}, `
      }
    }
    insert += ") VALUES ("
    for (let key in item) {
      if (key === "description") {
        insert += `'${item[key]}'`
      } else {
        insert += `'${item[key]}', `
      }
    }
    insert += ")"
    insert += "RETURNING id"

    try {
      const data = await sequelizeConfig.query(insert, {
        type: QueryTypes.INSERT
      })
      res.send(data)
    } catch (err) {
      res
        .status(500)
        .send("Some error occurred while creating the template " + err)
    }
  }
  // Retrieve all Forms from the database.
  @Get("")
  public async findAll(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    var formName = req.query.formName
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${formName}_template`,
      {
        type: QueryTypes.SELECT
      }
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }

  // Find a single Forms with a customerId
  @Get("/:prodId/:name")
  public async findOne(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.prodId
    var name = req.params.name
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${name}_template  WHERE id = ${id} `,
      {
        type: QueryTypes.SELECT
      }
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }

  public async findTemplates(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    var formName = req.params.formName

    const data = await sequelizeConfig.query(
      `SELECT * FROM ${formName}_template`,
      {
        type: QueryTypes.SELECT
      }
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }
  @Put("/:id/:name")
  public async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id
    const name = req.params.name
    const templateName = body.name
    const templateAttribute = body.attributes
    const num = await sequelizeConfig.query(
      `UPDATE ${name}_template SET name = '${templateName}',description = '${
        req.body.description
      }',
  attributes = '${JSON.stringify(templateAttribute)}' WHERE id = ${id}`,
      {type: QueryTypes.UPDATE}
    )

    try {
      if (num == 1) {
        res.send({
          message: "Form was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Form with id=${id}. Maybe Form was not found or req.body is empty!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Form with id=" + err
      })
    }
  }

  // Delete a Forms with the specified id in the request
  @Delete("/:id/:name")
  public async deleteForm(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const name = req.params.name
    await sequelizeConfig.query(
      `Delete from ${name}_template WHERE id = ${id}`,
      {
        type: QueryTypes.DELETE
      }
    )
    try {
      res.send({
        message: "Form was deleted successfully."
      })
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Form with id=" + err
      })
    }
  }
  @Get("/fetchAllTemplates/")
  public async fetchAllTemplates(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const data = await Item.findAll()
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Forms" + err
      })
    }
  }

  // Delete a Forms with the specified id in the request
  public async deleteFromTemplate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const itemtempid = req.params.id
    const name = req.params.name
    await sequelizeConfig.query(
      `Delete from ${name}_template WHERE itemtempid = ${itemtempid}`,
      {
        type: QueryTypes.DELETE
      }
    )
    try {
      res.send({
        message: "Form was deleted successfully."
      })
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Form with id=" + err
      })
    }
  }
}
