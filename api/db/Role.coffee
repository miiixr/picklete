
module.exports = (sequelize, DataTypes) ->
  Role = sequelize.define('Role', {
    authority: DataTypes.STRING
  }, classMethods: associate: (models) ->
    Role.hasMany models.User
    return
  )
  return Role
