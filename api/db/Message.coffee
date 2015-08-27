
module.exports = (sequelize, DataTypes) ->
  Message = sequelize.define('Message', {
    type: DataTypes.ENUM(
      'orderConfirm',
      'paymentConfirm',
      'deliveryConfirm',
      'orderSync'
    )
    to: DataTypes.STRING
    subject: DataTypes.STRING
    content: DataTypes.TEXT
    success: DataTypes.BOOLEAN
  }, classMethods: associate: (models) ->
    return
  )
  return Message
