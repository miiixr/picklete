
module.exports = (sequelize, DataTypes) ->
  User = sequelize.define('User', {
    username: DataTypes.STRING
    fullName: DataTypes.STRING
    gender: DataTypes.ENUM('none', 'male', 'female')
    email: DataTypes.STRING
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
      defaultValue: false
  }, classMethods: associate: (models) ->
    User.hasMany models.Passport
    User.belongsTo models.Role
    User.belongsToMany(models.Like, {through: 'UserLike'});
    return
  )
  return User
