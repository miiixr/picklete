
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    # id:
    #   type: DataTypes.UUID
    #   primaryKey: true
    #   defaultValue: DataTypes.UUIDV4
    # 訂單編號，提供給平台使用
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER
    # 訂單成立後更新的編號，由 allpay 提供
    merchantTradeNo: DataTypes.STRING
    # 結帳時系統自動算的金額
    paymentTotalAmount: DataTypes.FLOAT
    # 付款確認資訊
    paymentIsConfirmed: DataTypes.BOOLEAN
    # 訂單確認日期
    paymentConfirmDate: DataTypes.DATE
    # 訂單名稱
    paymentConfirmName: DataTypes.STRING
    # 匯款後五碼
    paymentConfirmPostfix: DataTypes.STRING
    # 傳統ATM轉帳由user轉帳完自行填寫確認的金額
    paymentConfirmAmount: DataTypes.FLOAT
    # 匯款完成後，要請使用者填寫她匯款的金額，以便後續對帳確認，使用於無 allpay 的情形
    paymentCreateConfirmAmount: DataTypes.FLOAT

    # 歐付寶
    # todo: 不適合放這裡應該要搬到關聯表
    # 訂單編號，提供給 allpay 使用
    TradeNo: DataTypes.STRING
    # allpay 回傳資訊
    allPayRtnCode: DataTypes.INTEGER
    # allpay 回傳資訊
    allPayRtnMsg: DataTypes.STRING
    # allpay 採用金流方式
    allPayPaymentType: DataTypes.STRING
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
    # 訂單備註
    description: DataTypes.STRING
    # 訂單狀態
    status:
      type: DataTypes.ENUM('new', 'paymentConfirm', 'deliveryConfirm')
      defaultValue: 'new'
  }, classMethods: associate: (models) ->
    # user information / buyer
    Order.belongsTo models.User
    # order items, list detail of purcharse items in Order.
    # so orderItem save detail information of Order
    # Order 為大表，詳細到底買了哪些東西，就是 orderItem 裡面描述
    Order.hasMany models.OrderItem

    # shipping information, 本島，離島運送，運費多少
    Order.hasOne models.Shipment
    # invoice type, 二聯，三聯，以及發票格式會有不同
    Order.belongsTo models.Invoice
    return
  )
  return Order
