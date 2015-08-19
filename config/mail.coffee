
module.exports.mail = {
  type: 'ses'
  config: {
    from: '',
    transporter: {
      accessKeyId: '',
      secretAccessKey: '',
    }
  }
  templete: {
    orderConfirm: {
      subject: '訂單 %(orderSerialNumber)s 建立完成',
      text: """
      Dear %(username)s:

      感謝你的訂購，你所購買的產品 %(productName)s 已訂購完成
      訂單編號為： %(orderSerialNumber)s
      收件者為： %(shipmentUsername)s
      收件地址為： %(shipmentAddress)s

      煩請你確認。

      """
    }
  }
}
