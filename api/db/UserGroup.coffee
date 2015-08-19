
module.exports = (sequelize, DataTypes) ->
  UserGroup = sequelize.define('UserGroup', {
    name: DataTypes.STRING
    level: DataTypes.INTEGER
    comment: DataTypes.STRING
  }, classMethods: associate: (models) ->
    UserGroup.hasMany models.User
    return
  )
  return UserGroup
