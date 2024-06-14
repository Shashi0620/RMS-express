import db from "../models"
const ItemTemplate = db.itemtemplates
const Op = db.Sequelize.Op
import {Request, Response} from "express"
import {QueryTypes} from "sequelize"
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
@JsonController("/api/itemTemplate")
export class ItemTemplateController {
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
    const itemTemplate = {
      name: req.body.name,
      subscriberId: req.body.subscriberId
    }
    // Save Tutorial in the database
    const data = await ItemTemplate.create(itemTemplate)
    try {
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
    const data = await ItemTemplate.findAll({
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

  // Update a Tutorial by the id in the request
  @Put("/:id")
  public async update(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const num = await ItemTemplate.update(req.body, {
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Item Template was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + err
      })
    }
  }

  // Delete a Tutorial with the specified id in the request
  @Delete("/:id")
  public async deleteItemTemplate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id

    const num = await ItemTemplate.destroy(
      {
        where: {id: id}
      },
      QueryTypes.DELETE
    )
    try {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + err
      })
    }
  }
}
