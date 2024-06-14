module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define("client", {
    name: {
      type: Sequelize.STRING
    },
    planFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "plans",
        key: "id"
      }
    }
  })

  Client.associate = function (models) {
    Client.hasMany(models.User, {as: "user"})
  }

  Client.associate = function (models) {
    Client.hasMany(models.Rack, {as: "racks"})
  }

  Client.associate = models => {
    Client.belongsTo(models.Plan, {
      foreignKey: "planFk",
      as: "plans"
    })
  }

  Client.associate = function (models) {
    Client.hasMany(models.Store, {as: "stores"})
  }
  return Client
}
