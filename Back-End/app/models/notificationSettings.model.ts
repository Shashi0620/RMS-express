module.exports = (sequelize, Sequelize) => {
  const NotificationSettings = sequelize.define("notificationSettings", {
    settingName: {
      type: Sequelize.STRING
    },
    notificationType: {
      type: Sequelize.STRING
    },
    isEscalationRequired: {
      type: Sequelize.BOOLEAN
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

  NotificationSettings.associate = models => {
    NotificationSettings.belongsTo(models.Store, {
      foreignKey: "storeFk",
      as: "store"
    })
  }

  NotificationSettings.associate = function (models) {
    NotificationSettings.hasMany(models.Escalation, {as: "escalation"})
  }

  NotificationSettings.associate = function (models) {
    NotificationSettings.hasMany(models.TrayItem, {as: "trayItems"})
  }
  return NotificationSettings
}
