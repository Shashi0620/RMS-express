module.exports = (sequelize, Sequelize) => {
  const userProfile = sequelize.define("userprofile", {
    userName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    createdBy: {
      type: Sequelize.STRING
    },

    user_fk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id"
      }
    }
  })

  userProfile.associate = models => {
    userProfile.belongsTo(models.User, {
      foreignKey: "user_fk",
      as: "users"
    })
  }

  return userProfile
}
