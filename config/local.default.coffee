module.exports = {
  createInitData: true
  useAllPay: true
  environment: ''
  initData: ''
  domain: 'http://localhost:1337'
  # mail: {
  #   type: 'ses'
  #   active: false
  #   config: {
  #     from: '',
  #     transporter: {
  #       accessKeyId: '',
  #       secretAccessKey: '',
  #     }
  #   }
  # }
  mail:{
    type: 'smtp'
    active: true
    config:{
      from: 'XXXXXXX@gmail.com',
      transporter: {
          port: 465,
          host: 'smtp.gmail.com',
          secure: true,
          auth: {
            user: '',
            pass: '',
            xoauth2: ''
          },
          ignoreTLS: false,
          name: '',
          localAddress: '',
          connectionTimeout: 2000,
          greetingTimeout: 2000,
          socketTimeout: 2000,
          debug: false,
          authMethod: 'PLAIN',
          tls: {}
      }
    }
  }
  db: {
    'username': process.env.MYSQL_USER || "root"
    'password': process.env.MYSQL_PASSWORD || "root"
    'host': process.env.MYSQL_1_PORT_3306_TCP_ADDR || "127.0.0.1"
    'port': process.env.MYSQL_1_PORT_3306_TCP_PORT || 3306
    'database': 'picklete',
    'dialect': 'mysql',
    'force': true
  }
  allpay: {
    merchantID: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIV: 'v77hoKGq4kWxNNIS',
    debug: true,
    ReturnURL:'/allpay/paid',
    ClientBackURL:'/shop/products',
    PaymentInfoURL:'/allpay/paymentinfo',
    paymentMethod:[
      {
        code: 'ATM',
        name: 'ATM'
      },{
        code: 'Credit',
        name: '信用卡'
      }
    ]
  }
  i18n: {
    localesDirectory: '/config/locales'
  }
  store:{
    name:'i+DEAL創而有意',
    name2:'i+DEAL',
    name3:'創而有意',
    serviceMail:'service@wevo.com.tw'
  }
}
