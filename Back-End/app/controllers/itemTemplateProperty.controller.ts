import db from "../models"
const ItemTemplateProperty = db.itemtemplatepropertys
const Op = db.Sequelize.Op
import {Request, Response} from "express"
import {
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
@JsonController("/api/itemProperties")
export class ItemTemplatePropertyController {
  // Create and Save a new Tutorial
  @Post("/")
  public async create(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      })
      return
    }
    // Create a Tutorial
    const itemTemplateProperty = {
      name: req.body.name,
      subscriberId: req.body.subscriberId,
      description: req.body.description,
      label: req.body.label,
      type: req.body.type,
      required: req.body.required
    }
    // Save Tutorial in the database
    const data = await ItemTemplateProperty.create(itemTemplateProperty)
    try {
      data.dataValues.name = itemTemplateProperty.label.split(" ").join("")
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the users." + err
      })
    }
  }

  // Retrieve all Tutorials from the database.
  @Get("/")
  public async findAll(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const title = req.query.first
    var condition = title ? {title: {[Op.like]: `%${title}%`}} : null
    const data = await ItemTemplateProperty.findAll({
      where: condition
    })
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving Users." + err
      })
    }
  }

  // Update a Template property by the id in the request
  @Put("/:id")
  public async update(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const num = await ItemTemplateProperty.update(req.body, {
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Template property was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Template property with id=${id}. Maybe Template property was not found or req.body is empty!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + err
      })
    }
  }
  // Delete a Template property with the specified id in the request
  @Delete("/:id")
  public async deleteTempProp(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const num = await ItemTemplateProperty.destroy({
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Template property  was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Template property  with id=${id}. Maybe Template property  was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Template property  with id=" + err
      })
    }
  }
}
