import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
const Stores = db.stores
db.Sequelize = Sequelize
import {Request, Response} from "express"
import {
  Body,
  BodyParam,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res
} from "routing-controllers"
import {Service} from "typedi"
// Create and Save a new Tutorial
@Service()
@JsonController("/api/store")
export class StoreController {
  @Post("/createStore")
  public async create(
    @Req() req: Request,
    @Res() res: Response,
    @BodyParam("storeName") storeName: string,
    @BodyParam("address") address: string,
    @BodyParam("client_fk") client_fk: string
  ): Promise<void> {
    // Validate request
    if (!storeName) {
      res.status(400).send({
        message: "Body cannot be empty!"
      })
      return
    }
    // Create a Tutorial
    const store = {
      storeName,
      address,
      client_fk
    }

    // Save Tutorial in the database
    const response = await Stores.create(store)
    try {
      res.send(response)
    } catch (err) {
      res
        .status(500)
        .send("Some error occurred while creating the stores." + err)
    }
  }
  @Get("/fetchStoreById/:storeId")
  public async fetchStoreById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const storeId = req.params.storeId
    const response = await Stores.findByPk(storeId)
    try {
      res.send(response)
    } catch (err) {
      res.status(500).send("Error retrieving Store with storeId=" + err)
    }
  }
  @Put("/updateById/:storeId")
  public async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param("storeId") storeId: number,
    @Body() body: any
  ): Promise<void> {
    const storeID = storeId
    const RequestBody = body
    await Stores.update(RequestBody, {
      where: {storeId: storeID}
    })
    try {
      res.status(200).json("tray was updated successfully!")
    } catch (e) {
      res
        .status(500)
        .send(
          `Cannot updated tray with id=${storeID}. Maybe tray was not found!`
        )
    }
  }
  @Delete("/:storeId")
  public async storeDelete(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const storeId = req.params.storeId
    await Stores.destroy({
      where: {storeId: storeId}
    })
    try {
      res.status(200).json("store was updated successfully!")
    } catch (err) {
      res
        .status(500)
        .send(
          `Cannot updated store with id=${storeId}. Maybe store was not found!` +
            err
        )
    }
  }

  //Fetch Store By ClientId
  @Get("/fetchAllStoresByClientFK/:client_fk")
  public async fetchAllStoresByClientFK(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const client_fk = req.params.client_fk
    const data = await Stores.findAll(
      {where: {client_fk: client_fk}},
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving locations" + err
      })
    }
  }
}
