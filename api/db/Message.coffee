
module.exports = (sequelize, DataTypes) ->
  Message = sequelize.define('Message', {
    sendBy: DataTypes.ENUM(
      'email',
      'sms'
    )
    type: DataTypes.ENUM(
      'orderConfirm',
      'paymentConfirm',
      'deliveryConfirm',
      'orderSync'
    )
    to: DataTypes.STRING
    subject: DataTypes.STRING
    text: DataTypes.TEXT
    html: DataTypes.TEXT
    success: DataTypes.BOOLEAN
    error: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return
  )
  return Message
