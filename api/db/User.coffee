
module.exports = (sequelize, DataTypes) ->
  User = sequelize.define('User', {
    username: DataTypes.STRING
    fullName: DataTypes.STRING
    gender: DataTypes.ENUM('none', 'male', 'female')
    email:
      type: DataTypes.STRING
      unique: true
    mobile: DataTypes.STRING
    birthYear: DataTypes.STRING
    birthMonth: DataTypes.STRING
    birthDay: DataTypes.STRING
    birthDate:
      type: DataTypes.DATE
      defaultValue: DataTypes.NOW
    address: DataTypes.STRING
    city: DataTypes.STRING
    region: DataTypes.STRING
    zipcode: DataTypes.INTEGER
    address: DataTypes.STRING
    comment: DataTypes.STRING
    orderSyncToken: DataTypes.STRING
    forgotToken: DataTypes.STRING
    verification:
      type: DataTypes.BOOLEAN
      # for hack the verify part
      defaultValue: true
    admin:
      type: DataTypes.BOOLEAN
      defaultValue: false
    dateCreated:
      type: DataTypes.DATE
      defaultValue: DataTypes.NOW
    lastUpdated:
      type: DataTypes.DATE
      defaultValue: DataTypes.NOW
    privacyTermsAgree:
      type: DataTypes.BOOLEAN
      defaultValue: true
  }, classMethods: associate: (models) ->
    User.hasMany models.Passport
    User.belongsTo models.Role
    User.belongsToMany(models.Like, {through: 'UserLike'});
    User.belongsToMany(models.Product, {through: 'UserFavorite'})
    return
  )
  return User
