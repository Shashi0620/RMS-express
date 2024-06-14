module.exports = (sequelize, Sequelize) => {
  const Rack = sequelize.define("rack", {
    name: {
      type: Sequelize.STRING
    },
    no_of_rows: {
      type: Sequelize.INTEGER
    },
    no_of_columns: {
      type: Sequelize.STRING
    },
    createdBy: {
      type: Sequelize.STRING
    },
    client_fk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "clients",
        key: "id"
      }
    },
    storeFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "stores",
        key: "storeId"
      },
      onUpdate: "Cascade",
      onDelete: "Cascade"
    }
  })

  Rack.associate = function (models) {
    Rack.hasMany(models.Tray, {as: "tray"})
  }

  Rack.associate = models => {
    Rack.belongsTo(models.Client, {
      foreignKey: "client_fk",
      as: "client"
    })
  }

  Rack.associate = models => {
    Rack.belongsTo(models.Store, {
      foreignKey: "storeFk",
      as: "store"
    })
  }

  return Rack
}
