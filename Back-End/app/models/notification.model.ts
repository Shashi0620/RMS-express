module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notifications", {
    notificationType: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.JSON
    },
    noOfRetry: {
      type: Sequelize.INTEGER
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

  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      foreignKey: "userFk",
      as: "users"
    })
  }

  return Notification
}
