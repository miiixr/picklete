
module.exports = (sequelize, DataTypes) ->
  Message = sequelize.define('Message', {
    sendBy: DataTypes.ENUM(
      'email',
      'sms'
    )
    type: DataTypes.ENUM(
      'greeting',
      'orderConfirm',
      'paymentConfirm',
      'deliveryConfirm',
      'orderSync'
    )
    from: DataTypes.STRING
    to: DataTypes.STRING
    toName: DataTypes.STRING
    subject: DataTypes.STRING
    text: DataTypes.TEXT
    html: DataTypes.TEXT
    success: DataTypes.BOOLEAN
    response: DataTypes.STRING
    error: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return
  )
  return Message
