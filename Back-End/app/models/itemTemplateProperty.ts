module.exports = (sequelize, Sequelize) => {
  const ItemTemplatePropertys = sequelize.define("itemtemplatepropertys", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    subscriberId: {
      type: Sequelize.INTEGER
    },
    label: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    required: {
      type: Sequelize.BOOLEAN
    }
  })
  return ItemTemplatePropertys
}
