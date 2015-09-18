
module.exports = (sequelize, DataTypes) ->
  TopicActive = sequelize.define('TopicActive', {
    title: DataTypes.STRING
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, classMethods: associate: (models) ->
    TopicActive.belongsTo models.Image, {as: 'ImageA'}
    TopicActive.belongsTo models.Image, {as: 'ImageA1'}
    TopicActive.belongsTo models.Image, {as: 'ImageA2'}

    TopicActive.belongsTo models.Image, {as: 'ImageB'}
    TopicActive.belongsTo models.Image, {as: 'ImageB1'}
    TopicActive.belongsTo models.Image, {as: 'ImageB2'}

    TopicActive.belongsTo models.Image, {as: 'ImageC'}
    TopicActive.belongsTo models.Image, {as: 'ImageC1'}
    TopicActive.belongsTo models.Image, {as: 'ImageC2'}
    return
  )
  return TopicActive
