
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    # id:
    #   type: DataTypes.UUID
    #   primaryKey: true
    #   defaultValue: DataTypes.UUIDV4
    # 訂單編號，提供給平台使用
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER
    # 訂單編號，提供給 allpay 使用
    TradeNo: DataTypes.STRING
    # allpay 回傳資訊
    allPayRtnCode: DataTypes.INTEGER
    # allpay 回傳資訊
    allPayRtnMsg: DataTypes.STRING
    # allpay 採用金流方式
    allPayPaymentType: DataTypes.STRING
    # 結帳時系統自動算的金額
    paymentTotalAmount: DataTypes.FLOAT
    # 訂單已經付款成功
    paymentIsConfirmed: DataTypes.BOOLEAN
    # 訂單確認日期
    paymentConfirmDate: DataTypes.DATE
    # 訂單名稱
    paymentConfirmName: DataTypes.STRING

    paymentConfirmPostfix: DataTypes.STRING
    # 傳統ATM轉帳由user轉帳完自行填寫確認的金額
    paymentConfirmAmount: DataTypes.FLOAT
    # 
    paymentCreateConfirmAmount: DataTypes.FLOAT
    # allpay 交易日期
    allPayTradeDate: DataTypes.DATE
    # allpay bankcode
    BankCode: DataTypes.STRING
    # 要繳費的帳號
    vAccount: DataTypes.STRING
    # 過期日期
    ExpireDate: DataTypes.STRING
    # 支付交易編號
    PaymentNo: DataTypes.STRING
    # allpay 交易，用於 ibon, barcode 付帳流程上
    Barcode1: DataTypes.STRING
    Barcode2: DataTypes.STRING
    Barcode3: DataTypes.STRING
    # 使用紅利點數
    useBunusPoint: DataTypes.INTEGER
    # allpay 金額產生使用
    CheckMacValue: DataTypes.STRING
    # 訂單產生的時候的交易時間
    MerchantTradeDate: DataTypes.DATE
    description: DataTypes.DATE
    # 訂單狀態
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
