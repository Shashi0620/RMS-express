module.exports = (sequelize, Sequelize) => {
  const ItemForms = sequelize.define(
    "itemforms",
    {
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      attributes: {
        type: Sequelize.JSON
      },
      itemTempId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "templates",
          key: "id"
        }
      }
    },
    {}
  )

  ItemForms.associate = models => {
    ItemForms.belongsTo(models.Item, {
      foreignKey: "itemTempId",
      as: "itemTemplate"
    })
  }
  return ItemForms
}
