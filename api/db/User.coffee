
module.exports = (sequelize, DataTypes) ->
  User = sequelize.define('User', {
    username: DataTypes.STRING
    fullName: DataTypes.STRING
    email: DataTypes.STRING
    mobile: DataTypes.STRING
    birthDate:
      type: DataTypes.DATE
      defaultValue: DataTypes.NOW
    address: DataTypes.STRING
    comment: DataTypes.STRING
    orderSyncToken: DataTypes.STRING
    admin:
      type: DataTypes.BOOLEAN
      defaultValue: false
    remark: DataTypes.STRING
    dateCreated:
      type: DataTypes.DATE
      defaultValue: DataTypes.NOW
    lastUpdated:
      type: DataTypes.DATE
      defaultValue: DataTypes.NOW
  }, classMethods: associate: (models) ->
    User.hasMany models.Passport
    User.belongsTo models.Role
    return
  )
  return User
