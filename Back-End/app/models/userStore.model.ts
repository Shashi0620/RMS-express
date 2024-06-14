module.exports = (sequelize, Sequelize) => {
  const UserStore = sequelize.define(
    "userStore",
    {
      userFk: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "Cascade",
        onDelete: "Cascade"
      },

      storeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "stores",
          key: "storeId"
        },
        onUpdate: "Cascade",
        onDelete: "Cascade"
      },
      storeName: {
        type: Sequelize.STRING
      }
    },
    {}
  )

  UserStore.associate = models => {
    UserStore.belongsTo(models.User, {
      foreignKey: "userFk",
      as: "user"
    })
  }

  UserStore.associate = models => {
    UserStore.belongsTo(models.Store, {
      foreignKey: "storeFk",
      as: "store"
    })
  }
  return UserStore
}
