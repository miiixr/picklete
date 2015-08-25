
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
      Hi %(username)s:

      感謝你的訂購，你所購買的產品 %(productName)s 已訂購完成
      訂單編號為： %(orderSerialNumber)s
      收件者為： %(shipmentUsername)s
      收件地址為： %(shipmentAddress)s

      如果上述資料正確，請將款項 $... 匯款至以下帳號：

      銀行名稱：ＯＯＯＯ銀行 / ＯＯ分行
      銀行代碼：
      帳號：
      戶名：
      匯款金額： $...

      匯款後請按至以下連結確認。

      煩請你確認。

      From STORE_NAME
      """
    },
    paymentConfirm: {
      subject: '訂單 %(orderSerialNumber)s 已確認付款完成',
      text: """
      Hi %(username)s:

      您的付款已經確認，
      我們會盡快為您安排出貨事宜。

      From STORE_NAME
      """
    },
    deliveryConfirm: {
      subject: '訂單 %(orderSerialNumber)s 已完成出貨',
      text: """
      Hi %(username)s:

      From STORE_NAME
      """
    },
    orderSync: {
      subject: '使用者 email %(email)s 訂單查詢要求連結',
      text: """
      Hi %(username)s:

      請點選下列連結取得訂單資訊

      %(syncLink)s

      From STORE_NAME
      """
    }
  }
}
