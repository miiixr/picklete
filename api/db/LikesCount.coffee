module.exports = (sequelize, DataTypes) ->
  LikesCount = sequelize.define('LikesCount', {
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, classMethods: associate: (models) ->
    LikesCount.belongsTo(models.ProductGm)
    return
  )

  return LikesCount
