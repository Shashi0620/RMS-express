"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = __importDefault(require("sequelize"));
var seq_config_1 = require("../config/seq.config");
var db = {};
db.Sequelize = sequelize_1.default;
db.sequelize = seq_config_1.sequelizeConfig;
db.user = require("../models/user.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.role = require("../models/role.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
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
module.exports = db;
db.userprofile = require("./userProfile.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.racks = require("./rack.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.trays = require("./tray.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.stores = require("../models/store.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.trayItems = require("./trayItem.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.menus = require("../models/menu.model")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.notifications = require("../models/notification.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.notificationSettings = require("../models/notificationSettings.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.itemtemplates = require("./itemTemplate.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.templates = require("./item.model")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.itemtemplatepropertys = require("./itemTemplateProperty.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.userPreference = require("../models/userPreference.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.products = require("./itemForm.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.clients = require("./client.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.plans = require("./plan.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.files = require("../models/file.model")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.userStore = require("../models/userStore.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.escalation = require("../models/escalation.model.js")(seq_config_1.sequelizeConfig, sequelize_1.default);
db.role.hasMany(db.user, { as: "users" });
db.user.belongsTo(db.role, {
    foreignKey: "roleId",
    as: "role"
});
// db.products.belongsToMany(db.items, {
//   through: 'product_item',
//   foreignKey: 'itemId',
//   otherKey: 'productId'
// })
db.ROLES = ["admin", "moderator", "staff"];
//export default db
//# sourceMappingURL=index.js.map