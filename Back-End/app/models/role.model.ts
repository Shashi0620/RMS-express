module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("role", {
    name: {
      type: Sequelize.STRING
    }
  })

  Role.associate = function (models) {
    Role.hasMany(models.Menu, {as: "menu"})
  }

  Role.associate = function (models) {
    Role.hasMany(models.User, {as: "users"})
  }

  return Role
}
