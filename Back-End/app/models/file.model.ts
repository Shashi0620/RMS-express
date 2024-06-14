module.exports = (sequelize, Sequelize) => {
  const file = sequelize.define("files", {
    filename: {
      type: Sequelize.STRING
    },
    filepath: {
      type: Sequelize.STRING
    },
    user_fk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id"
      }
    },

    tray_fk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "trays",
        key: "id"
      }
    }
  })

  file.associate = models => {
    file.belongsTo(models.User, {
      foreignKey: "user_fk",
      as: "users"
    })
  }

  file.associate = models => {
    file.belongsTo(models.Tray, {
      foreignKey: "tray_fk",
      as: "tray"
    })
  }

  return file
}
