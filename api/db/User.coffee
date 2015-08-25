
module.exports = (sequelize, DataTypes) ->
  User = sequelize.define('User', {
    username: DataTypes.STRING
    email: DataTypes.STRING
    mobile: DataTypes.STRING
    address: DataTypes.STRING
    comment: DataTypes.STRING
    orderSyncToken: DataTypes.STRING
    admin:
      type: DataTypes.BOOLEAN
      defaultValue: false
  }, classMethods: associate: (models) ->
    User.hasMany models.Passport
    User.belongsTo models.Role
    return
  )
  return User
