
module.exports = (sequelize, DataTypes) ->
  User = sequelize.define('User', {
    username: DataTypes.STRING
    email: DataTypes.STRING
    mobile: DataTypes.STRING
    address: DataTypes.STRING
  }, classMethods: associate: (models) ->
    User.hasMany models.Passport
    return
  )
  return User
