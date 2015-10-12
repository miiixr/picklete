
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    # id:
    #   type: DataTypes.UUID
    #   primaryKey: true
    #   defaultValue: DataTypes.UUIDV4
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER

    # 付款資訊
    paymentTotalAmount: DataTypes.FLOAT

    # 付款確認資訊
    paymentIsConfirmed: DataTypes.BOOLEAN
    paymentConfirmDate: DataTypes.DATE
    paymentConfirmName: DataTypes.STRING
    paymentConfirmPostfix: DataTypes.STRING
    paymentConfirmAmount: DataTypes.FLOAT
    paymentCreateConfirmAmount: DataTypes.FLOAT

    # 歐付寶
    # todo: 不適合放這裡應該要搬到關聯表
    TradeNo: DataTypes.STRING
    allPayRtnCode: DataTypes.INTEGER
    allPayRtnMsg: DataTypes.STRING
    allPayPaymentType: DataTypes.STRING
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
    description: DataTypes.DATE

    # 狀態記錄
    status:
      type: DataTypes.ENUM('new', 'paymentConfirm', 'deliveryConfirm')
      defaultValue: 'new'
  }, classMethods: associate: (models) ->
    Order.belongsTo models.User
    Order.hasMany models.OrderItem
    Order.hasOne models.Shipment
    Order.belongsTo models.Invoice
    return
  )
  return Order
