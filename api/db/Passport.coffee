
module.exports = (sequelize, DataTypes) ->
  Passport = sequelize.define('Passport', {
    protocol: DataTypes.STRING
    password: DataTypes.STRING
    accessToken: DataTypes.STRING
    provider: DataTypes.STRING
    identifier: DataTypes.STRING
    tokens: {
      type: DataTypes.TEXT
      get: ->
        if value = @getDataValue('tokens')
          JSON.parse value
        else
          []
      set: (value) ->
        console.log 'value', value
        @setDataValue 'tokens', JSON.stringify value
    }

  }, classMethods: {
    associate: (models) ->
      Passport.belongsTo models.User
      return
  }, instanceMethods: {
    validatePassword: (password, next) ->
      return next(null, true) if password is @getDataValue('password')
      return next(null, false)
  })
  return Passport
