import Sequelize from "sequelize"
import {sequelizeConfig} from "../config/seq.config"
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelizeConfig

db.user = require("../models/user.model.js")(sequelizeConfig, Sequelize)
db.role = require("../models/role.model.js")(sequelizeConfig, Sequelize)

// db.role.belongsToMany(db.user, {
//   through: 'user_roles',
//   foreignKey: 'roleId',
//   otherKey: 'userId'
// })
// db.user.belongsToMany(db.role, {
//   through: 'user_roles',
//   foreignKey: 'userId',
//   otherKey: 'roleId'
// })
//db.ROLES = ['user', 'admin', 'moderator']

module.exports = db

db.userprofile = require("./userProfile.model.js")(sequelizeConfig, Sequelize)
db.racks = require("./rack.model.js")(sequelizeConfig, Sequelize)
db.trays = require("./tray.model.js")(sequelizeConfig, Sequelize)
db.stores = require("../models/store.model.js")(sequelizeConfig, Sequelize)
db.trayItems = require("./trayItem.model.js")(sequelizeConfig, Sequelize)
db.menus = require("../models/menu.model")(sequelizeConfig, Sequelize)
db.notifications = require("../models/notification.model.js")(
  sequelizeConfig,
  Sequelize
)
db.notificationSettings = require("../models/notificationSettings.model.js")(
  sequelizeConfig,
  Sequelize
)
db.itemtemplates = require("./itemTemplate.model.js")(
  sequelizeConfig,
  Sequelize
)
db.templates = require("./item.model")(sequelizeConfig, Sequelize)
db.itemtemplatepropertys = require("./itemTemplateProperty.js")(
  sequelizeConfig,
  Sequelize
)
db.userPreference = require("../models/userPreference.model.js")(
  sequelizeConfig,
  Sequelize
)
db.products = require("./itemForm.model.js")(sequelizeConfig, Sequelize)
db.clients = require("./client.model.js")(sequelizeConfig, Sequelize)
db.plans = require("./plan.model.js")(sequelizeConfig, Sequelize)
db.files = require("../models/file.model")(sequelizeConfig, Sequelize)
db.userStore = require("../models/userStore.model.js")(
  sequelizeConfig,
  Sequelize
)
db.escalation = require("../models/escalation.model.js")(
  sequelizeConfig,
  Sequelize
)

db.role.hasMany(db.user, {as: "users"})
db.user.belongsTo(db.role, {
  foreignKey: "roleId",
  as: "role"
})

// db.products.belongsToMany(db.items, {
//   through: 'product_item',
//   foreignKey: 'itemId',
//   otherKey: 'productId'
// })

db.ROLES = ["admin", "moderator", "staff"]

//export default db
