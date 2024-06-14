import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
db.Sequelize = Sequelize
const UserStore = db.userStore
import {Request, Response} from "express"
import {Body, Req, Res} from "routing-controllers"
import {Service} from "typedi"
@Service()
export class UserStoreController {
  public async addStaffToStore(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userStore = {
      userFk: req.body.userFk,
      storeId: req.body.storeId,
      storeName: req.body.storeName
    }
    // Save Rack in the database
    const data = await UserStore.create(userStore)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while Adding Staff To Store." + err
      })
    }
  }

  public async fetchStoreByStaffId(
    userFk,
    staffdata,
    @Req() res
  ): Promise<void> {
    const userFkId = userFk
    const staff = staffdata
    const staffToStore = {staff: {stores: {}}}
    staffToStore.staff = staff.dataValues
    const data1 = await UserStore.findAll(
      {where: {userFk: userFkId}},
      QueryTypes.SELECT
    )
    try {
      staffToStore.staff.stores = data1
      const response = staffToStore
      res.send(response)
    } catch (err) {
      err
    }
  }

  public async deleteStoreByStaffId(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userFk = req.params.userFk
    const num = await UserStore.destroy(
      {
        where: {userFk: userFk}
      },
      QueryTypes.DELETE
    )
    try {
      if (num == 1) {
        res.send({
          message: "Store was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Store with id=${userFk}. Maybe Store was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Store with id=" + err
      })
    }
  }
}
