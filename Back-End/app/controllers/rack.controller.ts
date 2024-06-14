import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import {Request, Response} from "express"
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res
} from "routing-controllers"
const logger = require("pino")()
const Rack = db.racks
const Tray = db.trays
db.Sequelize = Sequelize
import {Service} from "typedi"
@Service()
@JsonController("/api/rack")
export class RackController {
  @Post("/createRack")
  public async rackCreate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const rack = body
    const data = await Rack.create(rack)
    try {
      res.send(data)
      this.createTrayObject(data.id, data.no_of_rows, data.no_of_columns)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Rack." + err
      })
    }
  }
  public async createTrayObject(id, no_of_rows, no_of_columns): Promise<void> {
    var tray = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      rack_fk: 0,
      name: "",
      color: ""
    }
    for (let i = 1; i <= no_of_rows; i++) {
      for (let j = 1; j <= no_of_columns; j++) {
        tray.rack_fk = id
        tray.x = i
        tray.y = j
        tray.w = 1
        tray.h = 1
        tray.name = "r" + tray.x + "c" + tray.y
        tray.color = "0000ff"
        Tray.create(tray)
      }
    }
  }

  //1Find a single Tutorial with an id
  @Get("/fetchRackById/:id")
  public async fetchRackById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    let data = {}
    try {
      if (id != null) {
        data = await Rack.findByPk(id)
        res.status(200).json(data)
      } else {
        res.send("Id required")
      }
    } catch (err) {
      res.status(500).send("error message not inserted" + err)
    }
  }
  @Get("/:client_fk")
  public async findAll(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const client_fk = req.params.client_fk
    const data = await Rack.findAll(
      {
        where: {client_fk: client_fk},
        order: [["createdAt", "Desc"]]
      },
      QueryTypes.SELECT
    )
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving racks with client_fk=" + err
      })
    }
  }

  // Update a Rack by the id in the request
  @Put("/:id")
  public async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param("id") id: number,
    @Body() body
  ): Promise<void> {
    const rackId = id
    const rackBody = body
    if (id == null) {
      res.send("Id is required")
    } else {
      const data = await Rack.update(rackBody, {
        where: {id: rackId}
      })
      try {
        if (data == null) {
          res.send("Not  updated Successfully").status(500)
        } else {
          res.status(200).json("Rack was update successfully!")
        }
      } catch (err) {
        res
          .status(500)
          .send(
            `Cannot update Rack with id=${id}. Maybe Tutorial was not found or req.body is empty!` +
              err
          )
      }
    }
  }
  // Delete a Rack with the specified id in the request
  @Delete("/:id")
  public async deleteRack(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    this.deleteTrayByRackFk(id)
    this.deleteTrayItem(id)
    if (id == null) {
      res
        .status(500)
        .send(`Cannot delete Rack with id=${id}. Maybe Rack was not found!`)
    } else {
      await Rack.destroy({
        where: {id: id}
      })

      res.status(200).json("Rack was deleted successfully!")
    }
  }

  //Fetch Rack By ClientId
  @Get("/fetchRackByClientId/:name/:client_fk")
  public async fetchRackByClientId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const tableName = req.params.name
    const client_fk = req.params.client_fk
    const data = await sequelizeConfig.query(
      `SELECT * FROM ${tableName} WHERE client_fk = ${client_fk}`,
      {
        type: QueryTypes.SELECT
      }
    )
    try {
      res.status(200).json(data)
    } catch (err) {
      res.status(500).send("cannot fetch the rack by clientId " + err)
    }
  }

  //Search Rack
  @Post("/searchRack")
  public async searchRack(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    var rackname = body.name
    var createdon = body.createdon
    var client_fk = body.client_fk
    let query
    if (createdon == "") {
      query = `SELECT * FROM racks WHERE name LIKE '%${rackname}%' AND client_fk = ${client_fk} `
    } else if (rackname == "") {
      query = `SELECT * FROM racks WHERE "createdAt" > '${createdon}' AND client_fk = ${client_fk} `
    } else
      query = `SELECT * FROM racks WHERE name LIKE '%${rackname}%' AND ("createdAt" > '${createdon}' AND client_fk = ${client_fk})`

    const data = await sequelizeConfig.query(query, {type: QueryTypes.SELECT})
    try {
      res.status(200).json(data)
    } catch (e) {
      res.status(500).send("error.message not inserted")
    }
  }
  //Tray Create
  @Post("/tray")
  public async trayCreate(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const tray = {
      x: body.x,
      y: body.y,
      h: body.h,
      w: body.w,
      name: body.name,
      color: body.color,
      quantity: body.quantity,
      searchable: body.searchable,
      attr1: body.attr1,
      val1: body.val1,
      attr2: body.attr2,
      val2: body.val2,
      attr3: body.attr3,
      val3: body.val3,
      attr4: body.attr4,
      val4: body.val4,
      attr5: body.attr5,
      val5: body.val5,
      attribute: body.attribute,
      img: body.img,
      createdBy: body.createdBy,
      modifiedBy: body.modifiedBy,
      rack_fk: body.rack_fk
    }
    // Save Tray in the database
    const response = await Tray.create(tray)
    try {
      res.status(200).json(response)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Tray." + err
      })
    }
  }

  // Find a single Tray with an id
  @Get("/tray/:id")
  public async fetchTrayById(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const response = await Tray.findByPk(id)
    try {
      res.send(response)
    } catch (error) {
      res.status(500).send(`Error retrieving Rack with id= ${id}` + error)
    }
  }
  // Update a Tray by the id in the request
  @Put("/tray/:id")
  public async updateTray(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id

    await Tray.update(body, {
      where: {id: id}
    })
    try {
      res.send({
        message: "Tray was updated successfully."
      })
    } catch (err) {
      res
        .status(500)
        .send(
          `Cannot update Tray with id=${id}. Maybe Tutorial was not found or req.body is empty!` +
            err
        )
    }
  }
  // Delete a Tray with the specified id in the request
  @Delete("/tray/:id")
  public async deleteTray(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id

    await Tray.destroy({
      where: {id: id}
    })
    try {
      res.send({
        message: "Tray was deleted successfully!"
      })
    } catch (err) {
      res
        .status(500)
        .send(
          `Cannot delete Tray with id=${id}. Maybe Tray was not found!` + err
        )
    }
  }
  //Delete Tray
  public async deleteTrayByRackFk(rack_fk): Promise<void> {
    const tableName = "trays"
    const data = await sequelizeConfig.query(
      `Delete from "${tableName}" where rack_fk = ${rack_fk} `,
      {
        type: QueryTypes.DELETE
      }
    )
    try {
      logger.info("Deleted Trays" + data)
    } catch (err) {
      logger.error("Error Deleting Trays" + err)
    }
  }
  @Delete("/DeleteTrayItem/:rackId")
  public async deleteTrayItem(@Req() req: Request): Promise<void> {
    const rackId = req.query.rackId
    const tableName = "trayItems"
    const data = await sequelizeConfig.query(
      `Delete from "${tableName}" where "rackId" = ${rackId} `,
      {
        type: QueryTypes.DELETE
      }
    )
    try {
      logger.info("Deleted trayItems" + data)
    } catch (err) {
      logger.error("Error Deleting trayItems" + err)
    }
  }
  @Get("/traylisting/data/:rack_fk")
  public async fetchTrayDataByRackId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const tableName = "trays"
    const tableName2 = "trayItems"
    const rack_fk = req.params.rack_fk
    let query = `SELECT ${tableName}.id,${tableName}.name,${tableName}.color,${tableName}."searchable",${tableName}.img,SUM("${tableName2}".quantity)
  AS quantity FROM ${tableName} FULL JOIN "${tableName2}"
  ON trays.id = "${tableName2}"."trayId"
  WHERE ${tableName}.rack_fk = ${rack_fk} 
  GROUP BY ${tableName}.id 
  ORDER BY ${tableName}.id ASC`
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    try {
      res.send(data).status(200)
    } catch (e) {
      res.status(500).send("error.message not inserted")
    }
  }
  //Fetch Tray By RackId
  @Get("/traylisting/props/:rack_fk")
  public async fetchTrayPropByRackId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const tableName = "trays"
    const rack_fk = req.params.rack_fk
    let query = `SELECT id,x,y,w,h FROM ${tableName} WHERE rack_fk = ${rack_fk} ORDER BY id ASC `
    const data = await sequelizeConfig.query(query, {type: QueryTypes.SELECT})
    try {
      res.status(200).json(data)
    } catch (e) {
      res.status(500).send("error.message not inserted")
    }
  }
  //Fetch Tray By RackId
  @Get("/fetchRackByStoreFk/:storeFk")
  public async fetchRackByStoreFk(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const storeFk = req.params.storeFk
    const data = await Rack.findAll(
      {
        where: {storeFk: storeFk},
        order: [["id", "ASC"]]
      },
      QueryTypes.SELECT
    )
    try {
      res.status(200).json(data)
    } catch (e) {
      res.status(500).send("error.message not inserted")
    }
  }
  @Put("/tray/props/:trayId")
  public async saveTrayLayout(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const trayList = body
    const id = req.params.trayId
    const filteredTrays = trayList.filter(trays => trays.id == id)
    let query = `UPDATE trays SET h = '${filteredTrays[0].h}',w = '${filteredTrays[0].w}',x = '${filteredTrays[0].x}',y = '${filteredTrays[0].y}' WHERE id = ${id}`
    const data = await sequelizeConfig.query(query, {type: QueryTypes.UPDATE})
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error updating TrayLayout" + err
      })
    }
  }
  @Get("/tray/items/")
  public async fetchTrays(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    let query = `SELECT DISTINCT r.name,s."storeName",s.longitude,s.latitude,s.location, from "trayItems" ti INNER JOIN trays t 
  on t.id=ti."trayId" INNER JOIN racks r
  on r.id=t.rack_fk INNER JOIN stores s
  on s."storeId"=r."storeFk" INNER JOIN "userStores" u
  on u."storeId"=s."storeId"`
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    try {
      res.status(200).json(data)
    } catch (err) {
      res.status(500).send("error.message not inserted" + err)
    }
  }
}
