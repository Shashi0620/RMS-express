module.exports = (sequelize, Sequelize) => {
  const Plan = sequelize.define("plans", {
    name: {
      type: Sequelize.STRING
    },
    noOfUsers: {
      type: Sequelize.INTEGER
    },
    noOfRacks: {
      type: Sequelize.INTEGER
    },
    noOfItemTypes: {
      type: Sequelize.INTEGER
    },
    rate: {
      type: Sequelize.INTEGER
    },
    planImg: {
      type: Sequelize.STRING
    }
  })

  return Plan
}
