module.exports.sms = {
  provider: 'mitake'
  config: {
    from: ''
    username: ''
    password: ''
    encoding: 'UTF8'
    callback: ''
    host: 'smexpress.mitake.com.tw'
    port: '9600'
  }
  templete: {
    greeting: {
      type: 'greeting',
      sendBy: 'sms',
      text: '歡迎 %(username)s 加入 %(storeName)s 會員！',
    }
  }
}
