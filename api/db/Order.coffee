
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    # id:
    #   type: DataTypes.UUID
    #   primaryKey: true
    #   defaultValue: DataTypes.UUIDV4
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER
    TradeNo: DataTypes.STRING
    allPayRtnCode: DataTypes.INTEGER
    allPayRtnMsg: DataTypes.STRING
    allPayPaymentType: DataTypes.STRING
    paymentTotalAmount: DataTypes.FLOAT
    paymentIsConfirmed: DataTypes.BOOLEAN
    paymentConfirmDate: DataTypes.DATE
    paymentConfirmName: DataTypes.STRING
    paymentConfirmPostfix: DataTypes.STRING
    paymentConfirmAmount: DataTypes.FLOAT
    paymentCreateConfirmAmount: DataTypes.FLOAT
    allPayTradeDate: DataTypes.DATE
    BankCode: DataTypes.STRING
    vAccount: DataTypes.STRING
    ExpireDate: DataTypes.STRING
    PaymentNo: DataTypes.STRING
    Barcode1: DataTypes.STRING
    Barcode2: DataTypes.STRING
    Barcode3: DataTypes.STRING
    useBunusPoint: DataTypes.INTEGER
    CheckMacValue: DataTypes.STRING
    MerchantTradeDate: DataTypes.DATE
    status:
      type: DataTypes.ENUM('new', 'paymentConfirm', 'deliveryConfirm')
      defaultValue: 'new'
  }, classMethods: associate: (models) ->
    Order.belongsTo models.User
    Order.hasMany models.OrderItem
    Order.hasOne models.Shipment
    return
  )
  return Order
