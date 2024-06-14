module.exports = (sequelize, Sequelize) => {
  const ItemTemplate = sequelize.define("itemtemplate", {
    name: {
      type: Sequelize.STRING
    },
    subscriberId: {
      type: Sequelize.INTEGER
    },
    description: {
      type: Sequelize.STRING
    }
  })

  return ItemTemplate
}
