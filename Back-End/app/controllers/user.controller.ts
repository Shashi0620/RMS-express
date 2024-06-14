import db from "../models"
import Sequelize, {QueryTypes} from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
import crypto from "crypto"
import config from "../configemail.json"
import fs from "fs"
import {UserNotification} from "../middleware/userNotification"
import elasticSearchController from "../controllers/elasticsearch.controller"
import {UserStoreController} from "../controllers/userStore.controller"
import {UserProfilesController} from "../controllers/userProfile.controller"
import {NotificationControllers} from "../controllers/notification.controller"
import emailConfig from "../config/email.config"
import {ItemController} from "../controllers/item.controller"
import {elasticSearchConfig} from "../config/connection"
import {Request, Response} from "express"
import * as jwt from "jsonwebtoken"
import {
  Body,
  BodyParam,
  Delete,
  Get,
  JsonController,
  Param,
  Params,
  Post,
  Put,
  QueryParam,
  Req,
  Res
} from "routing-controllers"
import {Service} from "typedi"

const logger = require("pino")()
const User = db.user
const Client = db.clients
const UserStore = db.userStore
const UserProfile = db.userprofile
db.Sequelize = Sequelize
const Plans = db.plans
const Role = db.role
var clientName = ""
@Service()
@JsonController("/api/user")
export class UserController {
  itemcontroller: ItemController = new ItemController()
  userNotification: UserNotification = new UserNotification()
  userProfilesController: UserProfilesController = new UserProfilesController()
  notificationControllers: NotificationControllers =
    new NotificationControllers()
  userStoreController: UserStoreController = new UserStoreController()
  collections: any = []
  @Get("/api/test/all")
  public async allAccess(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    res.status(200).send("Public Content.")
  }

  public async userBoard(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    res.status(200).send("User Content.")
  }

  public async adminBoard(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    res.status(200).send("Admin Content.")
  }

  public async moderatorBoard(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    res.status(200).send("Moderator Content.")
  }
  @Post("/")
  public async Create(
    @Req() req: Request,
    @Res() res: Response,
    @BodyParam("username") username: string,
    @BodyParam("email") email: string,
    @BodyParam("password") password: string,
    @BodyParam("phone") phone: string,
    @BodyParam("location") location: string,
    @BodyParam("clientFk") clientFk: string,
    @BodyParam("roleId") roleId: string,
    @BodyParam("plan") planFk: string
  ): Promise<void> {
    const user = {
      username,
      email,
      password,
      phone,
      location,
      clientFk,
      roleId,
      planFk,
      esUrl: ""
    }
    var hash = crypto.createHash("md5").update(user.password).digest("hex")
    user.password = hash
    user.esUrl =
      elasticSearchConfig.transport._config.host +
      "/rack/<RACK_NAME>_<RACK_PK>?routing=" +
      user.username +
      "/refresh=true"
    // Save User in the database
    const data = await User.create(user)

    try {
      res.send(data)
      this.createProfileObject(data)
      this.createNotification(data)
      this.sendEmailNotification(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Rack." + err
      })
    }
  }

  public async createNotification(data): Promise<void> {
    let status = "NEW"
    var notification = {
      notificationType: "",
      email: "",
      status: "",
      userFk: 0,
      noOfRetry: 0
    }
    ;(notification.notificationType = "REGISTERED"),
      (notification.email = data.email),
      (notification.status = status),
      (notification.userFk = data.id),
      (notification.noOfRetry = 3)

    this.userNotification.saveNotification(notification)
  }
  @Post("/login")
  public async login(
    @Req() req: Request,
    @Res() res: Response,
    @BodyParam("username") username: string,
    @BodyParam("password") password: string
  ): Promise<void> {
    const user = {
      username,
      password,
      status: "ACTIVE"
    }
    logger.info(user)
    var hash = crypto.createHash("md5").update(user.password).digest("hex")
    user.password = hash

    const data = await User.findOne({where: user})
    try {
      let payload = {username: user.username}
      let token = jwt.sign(payload, "SECRET_KEY")
      logger.info(token)
      res.send({
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        location: data.location,
        clientFk: data.clientFk,
        roleId: data.roleId,
        planFk: data.plan,
        token: token
      })
    } catch (error) {
      res.status(500).send({
        message: "Error retrieving Tray with id=" + error
      })
    }
  }
  @Post("/client")
  public async createClient(
    @Req() req: Request,
    @Res() res: Response,
    @BodyParam("name") name: string,
    @BodyParam("planFk") planFk: number
  ): Promise<void> {
    // Create a Client
    const clients = {
      name,
      planFk
    }

    // Save Client in the database
    const data = await Client.create(clients)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the client." + err
      })
    }
  }
  @Post("/client/staff/save/:clientName")
  public async saveClientStaff(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParam("clientName") clientName: string,
    @Body() body: any
  ): Promise<void> {
    const staff = body
    var hash = crypto.createHash("md5").update(staff.password).digest("hex")
    staff.password = hash
    staff.esUrl =
      elasticSearchConfig.transport._config.host +
      "/rack/<RACK_NAME>_<RACK_PK>?routing=" +
      staff.username +
      "/refresh=true"

    // Save User in the database
    const data = await User.create(staff)
    try {
      this.createProfileObject(data)
      if (req.body.stores.length > 0) {
        req.body.stores.forEach(store => {
          req.body.storeId = store.storeId
          req.body.storeName = store.storeName
          req.body.userFk = data.id
          this.userStoreController.addStaffToStore(req, res)
        })
      }
      logger.info("sending email..")
      const message = {
        from: config.fromEmailAddress,
        to: data.email,
        subject: config.registrationEmailSubject,
        template: "Registration",
        context: {data}
      }
      emailConfig.sendMail(message, error => {
        this.notificationControllers.updateNotificationStatus(error, data)
      })
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Rack." + err
      })
    }
  }

  //Fetch role
  @Get("/client/staff/role")
  public async getRole(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    let query = "SELECT id from roles WHERE name = 'Staff'"
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }
  @Get("/client/staff")
  public async getClientStaffList(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    var clientFk = req.query.clientFk
    var roleId = req.query.roleId
    var status = "ACTIVE"
    // Create a Client
    var tableName = "users"
    let query = `SELECT * FROM ${tableName} WHERE "clientFk" = ${clientFk} AND status = '${status}' AND  "roleId" = ${roleId}`
    const data = await sequelizeConfig.query(query, {type: QueryTypes.SELECT})
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }

  //Fetch role

  @Get("/client/name")
  public async getClientNameByID(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const clientFk = req.query.clientFk
    let query = `SELECT name from clients WHERE id = ${clientFk}`

    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    try {
      clientName = data[0].name
      res.send(data)
    } catch (err) {
      err
    }
  }

  // Find a single Customer with a customerId
  @Get("/client/staff/:id")
  public async findOne(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    const data = await User.findOne({where: {id: id}})
    try {
      req.query.userFk = data.id
      req.query.staff = data
      // const userFk = req.query.userFk
      // const staffdata = req.query.staff
      const response = await this.userStoreController.fetchStoreByStaffId(
        req.query.userFk,
        req.query.staff,
        res
      )
      res.send(response)
    } catch (err) {
      err
    }
  }

  // Update a Staff by the id in the request
  @Put("/client/staff/update/:id")
  public async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const id = req.params.id
    var hash = crypto.createHash("md5").update(body.password).digest("hex")
    body.password = hash
    const num = await User.update(body, {
      where: {id: id}
    })
    try {
      if (body.stores.length > 0) {
        req.params.userFk = req.params.id
        this.fetchStoreByStaffId(id, body.stores)
      }

      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Template with id=${id}. Maybe Template was not found or req.body is empty!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Template with id=" + err
      })
    }
  }

  public async fetchStoreByStaffId(userFk, stores): Promise<string> {
    const userId = userFk
    var store = {
      storeId: 0,
      userFk: 0,
      storeName: ""
    }
    UserStore.findAll({where: {userFk: userId}}, QueryTypes.SELECT).then(
      data => {
        let deleteRecord = data.filter(store =>
          stores.every(
            retrievedFromDb => retrievedFromDb.storeId !== store.storeId
          )
        )
        let saveRecordInToDb = stores.filter(store =>
          data.every(
            retrievedFromDb => retrievedFromDb.storeId !== store.storeId
          )
        )
        deleteRecord.forEach(store => {
          var storeId = store.storeId
          UserStore.destroy({
            where: {storeId: storeId}
          })
        })
        saveRecordInToDb.forEach(stores => {
          store.storeId = stores.storeId
          store.userFk = userId
          store.storeName = stores.storeName
          UserStore.create(store)
        })
      }
    )
    return "success"
  }

  @Get("/client/validation/:value/:type")
  public async validation(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const value = req.params.value
    const type = req.params.type
    let query
    if (value) {
      query = `SELECT * FROM users WHERE username = '${value}' `
    } else if (type) {
      query = `SELECT * FROM users WHERE email = '${type}' `
    }
    const data = await sequelizeConfig.query(query, {type: QueryTypes.SELECT})
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving users" + err
      })
    }
  }

  // Delete a Staff with the specified id in the request
  @Delete("/client/staff/delete/:id")
  public async deleteStaff(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.id
    req.params.user_fk = id
    this.userProfilesController.deleteProfile(req, res)
    const num = await User.destroy({
      where: {id: id}
    })
    try {
      if (num == 1) {
        res.send({
          message: "Staff was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete Staff with id=${id}. Maybe Staff was not found!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Could not delete Template with id=" + err
      })
    }
  }
  @Post("/client/resetPassword/")
  public async forgotpassword(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const user = {
      email: req.body.email
    }

    const email = user.email
    var randomNumber = Math.random().toString(36).slice(2)
    var hash = crypto.createHash("md5").update(randomNumber).digest("hex")
    const password = hash

    const data = await sequelizeConfig.query(
      `UPDATE users SET password = '${password}' WHERE email = '${email}' `,
      {
        type: QueryTypes.SELECT
      }
    )
    try {
      if (data[1].rowCount > 0) {
        const message = {
          from: config.fromEmailAddress,
          to: email,
          subject: config.subjectofPasswordEmail,
          template: "forgotpassword.hbs"
        }
        await emailConfig.sendMail(message, (error: string) => {
          this.notificationControllers.updateNotificationStatus(error, data)
        })
        res.send({
          message: "password was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update password with email=${email}.`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while update password" + err
      })
    }
  }

  public async createProfileObject(data): Promise<void> {
    var profile = {
      userName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      city: "",
      image: "",
      user_fk: 0
    }
    profile.userName = data.username
    profile.email = data.email
    profile.phone = data.phone
    profile.city = data.location
    profile.user_fk = data.id
    profile.password = data.password

    UserProfile.create(profile)
  }

  public async profileCreate(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const profile = {
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      image: req.body.image,
      user_fk: req.body.user_fk
    }
    // Save UserProfile in the database
    const data = await UserProfile.create(profile)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating the Rack." + err
      })
    }
  }

  // Retrieve all Plans from the database.
  @Get("/client/plans")
  public async findAllPlans(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    try {
      const data = await Plans.findAll({})
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving Users." + err
      })
    }
  }

  public async sendEmailNotification(data): Promise<void> {
    const link = config.EmailSystemUrl
    const message = {
      from: config.fromEmailAddress,
      to: data.email,
      subject: config.activationEmailSubject,
      template: "templateemail",
      context: {data, link}
    }
    emailConfig.sendMail(message, async error => {
      this.notificationControllers.updateNotificationStatus(error, data)
    })
  }
  @Get("/activation/:clientFk/:userPk")
  public async updateUserStatus(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const clientFk = req.params.clientFk
    const userPk = req.params.userPk
    req.query.clientFk = clientFk
    try {
      const data = await User.update({status: "ACTIVE"}, {where: {id: userPk}})

      logger.info(data)
      await this.generateUserMenuFile(userPk, res)
      this.createTemplateByPlan(req, res)
      res.send("successfully updated the user status")
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }
  @Put("/updateUserElasticSearchUrl/:userPk")
  public async updateUserElasticSearchUrl(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    var userPk = req.params.userPk
    const elasticSearch = {
      username: req.body.username,
      rackId: req.body.rackId,
      attributes: req.body.attributes,
      name: req.body.name
    }

    var esUrl =
      elasticSearchConfig.transport._config.host +
      "/rack/" +
      elasticSearch.name +
      "/" +
      elasticSearch.rackId +
      "?routing=" +
      elasticSearch.username +
      "/refresh=true"

    await sequelizeConfig.query(
      `UPDATE users SET "esUrl" = '${esUrl}' WHERE id = '${userPk}' `,
      {
        type: QueryTypes.UPDATE
      }
    )
    try {
      elasticSearchController.createIndex(req)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving user with id=" + err
      })
    }
  }

  public async createTemplateByPlan(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    this.getClientNameByID(req, res)
    const clientFk = req.query.clientFk
    let query = `SELECT p.* FROM plans p, clients c where c."planFk" = p.id and c.id = ${clientFk} `
    try {
      const data = await sequelizeConfig.query(query, {
        type: QueryTypes.SELECT
      })
      let planList = data[0]
      for (let i = 0; i < planList.noOfItemTypes; i++) {
        logger.info("clentName = " + clientName)
        var templateName = "Item_" + i + "_" + clientName
        req.query.clientFk = clientFk
        req.query.name = templateName
        this.itemcontroller.create(req, res)
      }
    } catch (err) {
      logger.error("Error in Creating Template")
    }
  }
  @Get("/role")
  public async getRoleNameByID(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    var roleId = req.query.roleId
    const data = await Role.findAll({where: {id: roleId}}, QueryTypes.SELECT)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }
  public static async getRoleName(roleId): Promise<string> {
    let nameRole: string
    let query = `SELECT name FROM roles WHERE id = ${roleId}`
    const data = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })
    if (data && data.length > 0) {
      nameRole = data[0].name
    }
    return nameRole
  }

  public async getUserName(userPk): Promise<string> {
    let userName: string
    if (userPk) {
      let query = `SELECT username FROM users WHERE id = ${userPk}`
      const data = await sequelizeConfig.query(query, {
        type: QueryTypes.SELECT
      })
      if (data.length > 0) {
        userName = data[0].username
      }
    }
    return userName
  }

  public async generateUserMenuFile(userPk, res: Response): Promise<void> {
    let query = ` SELECT label FROM menus WHERE "clientFk" IS NULL `
    const userMenus = await sequelizeConfig.query(query, {
      type: QueryTypes.SELECT
    })

    this.collections = userMenus.map(
      data => `{"Key":"${data.label}","Value":"${data.label}"}`
    )
    const userName = await this.getUserName(userPk)
    logger.info(userName + "fileName")

    //passing the path config key and file name
    if (typeof userName !== "undefined") {
      fs.writeFile(
        `${config.adminSystemUrl}/${userName}.json`,
        "[" + `${this.collections}` + "]",
        function (error) {
          if (error) {
            error
          } else {
            logger.info("Successfully write")
          }
        }
      )
    } else {
      res.send("userName is undefined")
    }
  }
  @Get("/getData/:username")
  public async readUserFile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userName = req.params.username
    const data = fs.readFileSync(`${config.adminSystemUrl}/${userName}.json`)
    const userdata = JSON.parse(data)
    res.send(userdata)
  }

  @Get("/client/validation/:value/:type")
  public async validations(req: Request, res: Response): Promise<void> {
    const value = req.params.value
    const type = req.params.type
    let query
    if (value) {
      query = `SELECT * FROM users WHERE username = '${value}'`
    } else if (type) {
      query = `SELECT * FROM users WHERE email = '${type}'`
    }
    const data = await sequelizeConfig.query(query, {type: QueryTypes.SELECT})
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving users" + err
      })
    }
  }

  //Fetch role
  @Get("/plan")
  public async getPlan(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.query.palnId
    const data = await Plans.findAll({where: {id: id}}, QueryTypes.SELECT)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }

  //Fetch role
  @Get("/client/fetchdata/:clientId")
  public async getClient(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const id = req.params.clientId
    const data = await Client.findAll({where: {id: id}}, QueryTypes.SELECT)
    try {
      res.send(data)
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving Form with id=" + err
      })
    }
  }

  @Post("/translateData/:username")
  public async saveData(@Body() body, @Req() req: Request): Promise<void> {
    const userName = req.params.username
    const randomdata = JSON.stringify(body)
    fs.writeFile(
      `${config.adminSystemUrl}/${userName}.json`,
      randomdata,
      error => {
        // Error checking
        if (error) {
          logger.info("New data is Not added")
        } else {
          logger.info("New data added")
        }
      }
    )
  }
  @Post("/addingUserMenuNewData/:userPk")
  public async addingUserMenuNewData(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ): Promise<void> {
    const userPk1 = req.params.userPk
    const newMenuData = body
    //calling getUserName function for getting username
    const userName = await this.getUserName(userPk1)

    const key = Object.keys(newMenuData)
    const value = Object.values(newMenuData)
    //passing the path config key and file name
    const data = fs.readFileSync(`${config.adminSystemUrl}/${userName}.json`)
    var userdata = JSON.parse(data)
    // jsonData.push(userdata)
    userdata[`${key}`] = `${value}`
    var jsonDataValue = JSON.stringify(userdata)

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await fs.writeFile(
      `${config.adminSystemUrl}/${userName}.json`,
      jsonDataValue,
      error => {
        // Error checking
        if (error) {
          logger.info("New data is Not added")
        } else {
          logger.info("New data added")
        }
      }
    )
    res.send("SuccessFully Saved Data")
  }
}
