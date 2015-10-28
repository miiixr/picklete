module.exports = (sequelize, DataTypes) ->
  PageView = sequelize.define('PageView', {
    pageView: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, classMethods: associate: (models) ->
    PageView.belongsTo(models.ProductGm)
    return
  )
  return PageView
