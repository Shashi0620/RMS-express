import db from "../models"
import {sequelizeConfig} from "../config/seq.config"
import {EscalationController} from "../controllers/escalation.controller"
import {Request, Response} from "express"
import {QueryTypes} from "sequelize"
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
const TrayItem = db.trayItems
@Service()
@JsonController("/api/trayItem")
export class TrayItemController {
  escalationController: EscalationController = new EscalationController()
  @Post("/createTrayItem")
  public async trayItemCreate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const trayItem = {
      quantity: body.quantity,
      upperLimit: body.upperLimit,
      lowerLimit: body.lowerLimit,
      rackId: body.rackId,
      trayId: body.trayId,
      formId: body.formId,
      tempId: body.tempId,
      userFk: body.userFk
      //notificationSettngFk: body.notificationSettngFk
    }
    // Save TrayItem in the database
    const response = await TrayItem.create(trayItem)
    await this.updateTray(body)
    try {
      res.status(200).json(response)
    } catch (err) {
      res
        .status(500)
        .send("Some error occurred while creating the TrayItem." + err)
    }
  }

  public async updateTray(@Body() body): Promise<void> {
    const trayItem = {
      quantity: body.quantity,
      trayId: body.trayId
    }
    let query = `UPDATE trays set quantity = quantity+${trayItem.quantity} WHERE Id = ${trayItem.trayId}`
    return await sequelizeConfig.query(query, {type: QueryTypes.UPDATE})
  }
  @Put("/:id")
  public async updateTrayItems(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id
    let query = `UPDATE "trayItems" SET quantity = '${body.quantity}', "lowerLimit"= '${body.lowerLimit}', "upperLimit"= '${body.upperLimit}' WHERE id = ${id} And "trayId" = ${body.trayId} And "tempId" = ${body.tempId} And "formId" = ${body.formId} `
    const data = await sequelizeConfig.query(query, {type: QueryTypes.UPDATE})
    try {
      if (data[1].rowCount > 0) {
        if (
          body.quantity >= body.lowerLimit &&
          body.quantity <= body.upperLimit
        ) {
          //req.params.notificationSettngFk = req.body.notificationSettngFk
          req.params.userFk = req.body.userFk
          this.escalationController.fetchByNotificationId(req, res)
        }
      } else {
        res.send({
          message: `Cannot update trayItems with id=${id}.`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Form with id=" + err
      })
    }
  }
  @Get("/findAllItems")
  public async findAllItems(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const data = await TrayItem.findAll(
      {order: [["updatedAt", "ASC"]]},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (e) {
      res.status(500).send({
        message: "Error retrieving racks with client_fk=" + e
      })
    }
  }
  @Get("/fetchItem/:formId")
  public async fetchItem(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const formId = req.params.formId
    const data = await TrayItem.findAll(
      {where: {formId: formId}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving trayItems with formId=" + err
      })
    }
  }
  @Get("/fetchTemplateAndTrayById/:tempId/:trayId")
  public async fetchTemplateAndTrayById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const tempId = req.params.tempId
    const trayId = req.params.trayId
    const data = await TrayItem.findAll(
      {
        where: {tempId: tempId, trayId: trayId},
        order: [["updatedAt", "ASC"]]
      },
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving trayItems with tempId=" + err
      })
    }
  }
  @Get("/fetchTrayTemplateAndFormById/:trayId/:tempId/:formId")
  public async fetchTrayTemplateAndFormById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const trayId = req.params.trayId
    const tempId = req.params.tempId
    const formId = req.params.formId
    const data = await TrayItem.findAll(
      {
        where: {
          trayId: trayId,
          tempId: tempId,
          formId: formId
        },
        order: [["updatedAt", "DESC"]]
      },
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving trayItems with tempId=" + err
      })
    }
  }
}
