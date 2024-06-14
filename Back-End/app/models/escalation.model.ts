module.exports = (sequelize, Sequelize) => {
  const Escalation = sequelize.define("escalation", {
    escalationType: {
      type: Sequelize.STRING
    },
    noOfRemainder: {
      type: Sequelize.STRING
    },
    timeToEscalate: {
      type: Sequelize.STRING
    },
    to: {
      type: Sequelize.STRING
    },
    notificationSettngFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "notificationSettings",
        key: "id"
      },
      onUpdate: "Cascade",
      onDelete: "Cascade"
    }
  })

  Escalation.associate = models => {
    Escalation.belongsTo(models.NotificationSettings, {
      foreignKey: "notificationSettngFk",
      as: "notificationSetting"
    })
  }

  return Escalation
}
