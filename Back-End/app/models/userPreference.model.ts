module.exports = (sequelize, Sequelize) => {
  const userPreference = sequelize.define("userPreference", {
    selectedColumns: {
      type: Sequelize.STRING
    },
    templateId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "templates",
        key: "id"
      }
    },

    userFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id"
      }
    }
  })

  userPreference.associate = models => {
    userPreference.belongsTo(models.Item, {
      foreignKey: "templateFK",
      as: "template"
    })
  }

  userPreference.associate = models => {
    userPreference.belongsTo(models.User, {
      foreignKey: "userFk",
      as: "user"
    })
  }

  return userPreference
}
