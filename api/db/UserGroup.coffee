
module.exports = (sequelize, DataTypes) ->
  UserGroup = sequelize.define('UserGroup', {
    name: DataTypes.STRING
    comment: DataTypes.STRING
  }, classMethods: associate: (models) ->
    UserGroup.hasMany models.User
    return
  )
  return UserGroup
