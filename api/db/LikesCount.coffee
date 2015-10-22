module.exports = (sequelize, DataTypes) ->
  LikesCount = sequelize.define('LikesCount', {
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, classMethods: associate: (models) ->
    LikesCount.hasOne(models.ProductGm)
    return
  )

  return LikesCount
