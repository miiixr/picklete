
module.exports = {
  port: process.env.PORT or 1337
  environment: process.env.NODE_ENV
  mailchimp:
    apiKey: "25592e91a2b20be38b4ee3169eeb9f68-us10"
  db: {
    'username': process.env.MYSQL_ENV_MYSQL_USER_NAME || "root"
    'password': process.env.MYSQL_ENV_MYSQL_USER_PASS || "root"
    'host': process.env.MYSQL_PORT_3306_TCP_ADDR || "127.0.0.1"
    'port': process.env.MYSQL_PORT_3306_TCP_PORT || 3306
    'database': process.env.MYSQL_ENV_MYSQL_USER_DB || 'picklete',
    'dialect': 'mysql',
    'timezone': '+08:00'
    'force': false
  }
}
